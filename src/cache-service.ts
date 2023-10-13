/**
 * Cache service class which is used to create the database
 */
export default class CacheService {
  static IndxDb: IDBFactory = window.indexedDB;
  static db: IDBDatabase | any;
  static dbName: string = "";
  static tableName: string = "";
  static refreshData = false;
  static cacheUrl = [];
  static skipParams = [];
  static async setupDB(
    dbName = "application-cache",
    tableName = "api-response",
    skipParams = []
  ) {
    this.skipParams = [];
    this.dbName = dbName;
    this.tableName = tableName;
    var req: IDBOpenDBRequest;
    this.addTab();
    req = await this.IndxDb.open(this.dbName, 3);
    req.onupgradeneeded = await this.AddTables;
    req.onsuccess = (e: any) => {
      this.db = e.target.result;
    };
    window.addEventListener("beforeunload", CacheService.resetDB);
  }

  static async AddTables(e: any) {
    this.db = e.target.result;
    const parms: IDBObjectStoreParameters = {
      autoIncrement: true,
      keyPath: "url",
    };
    let objectStore = await this.db?.createObjectStore(
      CacheService.tableName,
      parms
    );

    // create an index on the url property
    objectStore?.createIndex("url", "url", {
      unique: true,
    });
  }

  static async saveData(url: any, data: any) {
    if (this.db) {
      const txn = await this.db.transaction(
        CacheService.tableName,
        "readwrite"
      );
      // get the Contacts object store
      const store = await txn.objectStore(CacheService.tableName);
      store.put({
        url: url,
        content: data,
      });
    }
  }

  static validateUrl(endpoint: string) {
    return CacheService.cacheUrl.filter(
      (item: string) => URL + item == endpoint
    );
  }

  static async getData(id: string) {
    return new Promise((resolve, reject) => {
      if (!this.db || CacheService.refreshData) {
        resolve(false);
        return;
      }
      const txn = this.db.transaction(CacheService.tableName, "readonly");
      const store = txn.objectStore(CacheService.tableName);

      let query = store.get(id);

      query.onsuccess = (event: any) => {
        if (!event.target.result) {
          resolve(false);
        } else {
          resolve(event.target.result);
        }
      };

      query.onerror = (event: any) => {
        resolve(false);
      };
    });
  }

  static addTab() {
    if (!sessionStorage.getItem("tabCount")) {
      const windowCount = localStorage.getItem("tabCount");
      const tabCount = !windowCount ? 1 : parseInt(windowCount) + 1;
      localStorage.setItem("tabCount", tabCount.toString());
      sessionStorage.setItem("tabCount", "1");
    }
  }
  static removeTabItem(e: any) {
    const windowCount: any = localStorage.getItem("tabCount");
    const tabCount = !windowCount ? 0 : parseInt(windowCount) - 1;
    localStorage.setItem("tabCount", tabCount.toString());
  }
  static resetDB(e: any) {
    const windowCount: any = localStorage.getItem("tabCount");
    const tabCount = !windowCount ? 0 : parseInt(windowCount) - 1;
    localStorage.setItem("tabCount", tabCount.toString());
    sessionStorage.removeItem("tabCount");
    if (tabCount <= 0) {
      if (this.db) {
        CacheService.db.close();
        CacheService.IndxDb.deleteDatabase(CacheService.dbName);
      }
    }
  }

  static deleteDB() {
    if (this.db) {
      CacheService.db.close();
      CacheService.IndxDb.deleteDatabase(CacheService.dbName);
    }
  }
  static async deleteData() {
    if (this.db) {
      const txn = await this.db.transaction(
        CacheService.tableName,
        "readwrite"
      );
      const store = await txn.objectStore(CacheService.tableName);
      await store.clear();
    }
  }
}
