axios-storage-adapter
=====================

It's axios adapter for cache the api calls


## Install

```sh
npm install axios-storage-adapter
```

## Usage

```javascript
import Axios from "axios";
import { CacheService, StorageAdapter } from "axios-storage-adapter";

function App() {
  CacheService.setupDB("my-cache", "my-table", []);
  const request = Axios.create({
    adapter: StorageAdapter({
      cache: true,
    }) as any,
  });
  const loadData = () => {
    request.get("https://reqres.in/api/users?page=2").then((data) => {
      console.log(data);
    });
  };

  return (
    <>
      <button onClick={loadData}>Load</button>
    </>
  );
}

export default App;

```

## Available setupDB parameters
|parameter|description|
|--|----|
|database name| **optional** this is define your indexdDB database name|
|table name| **optional** this is define your indexdDB table name|
|parameters| **optional** which ever parameter skipped from the url parameter, add it as array format |

## Support
If you are facing any issue, please contact [via linkedin ( Libin Prasanth )](https://www.linkedin.com/in/libinprasanth/).

## Examples

Do you want to try **axios-storage-adapter** before use ?

 * [Simple example](https://codesandbox.io/s/axios-storage-adapter-nnmfh6)

## Donate!
Like my Work! [Donate](https://www.paypal.me/LibinPrasanth) 