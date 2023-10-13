import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import CacheService from "./cache-service";

// Default options for the storage adapter
const type = typeof axios.defaults.adapter == "object" ? axios.defaults.adapter[0] : "xhr";
const options = {
  adapter: axios.getAdapter(type),
  cache: false,
};

// Function to remove a parameter from a URL
function removeParam(key: string, sourceURL: string): string {
  let rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";

  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (let i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
  }

  return rtn;
}

// Function to make a request and handle caching
async function requestData(
  config: AxiosRequestConfig,
  url: string
): Promise<AxiosResponse> {
  try {
    const method = config.method === "get" ? axios.get : axios.post;
    const res = await method(config.url as string, config.data, {
      headers: config.headers,
    });
    const data = res.data;
    if (data) {
      CacheService.saveData(url, JSON.stringify(data));
    }
    return res;
  } catch (rej) {
    console.error(rej);
    throw rej;
  }
}

// Function to handle caching logic
async function cacheAdapter(config: any): Promise<AxiosResponse> {
  const { url, method } = config;
  if (
    (method?.toLowerCase() === "get" || method?.toLowerCase() === "post") &&
    options.cache
  ) {
    const params = CacheService.skipParams;
    let parsedUrl = url as string;
    params.forEach((item) => {
      parsedUrl = removeParam(item, parsedUrl);
    });

    const lastRequest: any = await CacheService.getData(parsedUrl);
    if (lastRequest && lastRequest.content) {
      const response: any = {
        data: JSON.parse(lastRequest.content),
        status: 200,
        statusText: "OK",
        _from_localstorage: true,
        config,
      };
      return response;
    }
    return requestData(config, parsedUrl);
  }
  return options.adapter(config);
}

// Main storage adapter function
export default function StorageAdapter(opts: any) {
  Object.assign(options, opts);
  // If caching is not enabled, return the default adapter
  if (!options.cache) return options.adapter;
  // Otherwise, return the cache adapter
  return cacheAdapter;
}
