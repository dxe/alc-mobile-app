import axios from "axios";
import { getStoredJSON, storeJSON } from "../util";
import { Dispatch, useCallback } from "react";

export const CONFERENCE_ID = 1;
export const BASE_URL = "https://alc-mobile-api.dxe.io/api";

interface APIOptions {
  // the request path
  path: string;
  // the request body
  body: {};
  // a function to pass the response data to on success
  onSuccess: any;
  // a function to pass the error message to on failure
  onError: Dispatch<any>;
  // the error message to pass to onError
  errorMessage: string;
  // the data to pass to onSuccess if the cache is empty
  fallback?: any;
  // whether or not to use cache
  useCache?: boolean;
}

export const postAPI = async function (options: APIOptions): Promise<void> {
  // First use the cached data if it exists
  if (options.useCache) options.onSuccess((await getStoredJSON(options.path)) || options.fallback);

  // Then try to fetch data from the server.
  try {
    console.log(`posting: ${options.path}`); // TODO: remove after debugging
    const res = await axios.post(BASE_URL + options.path, options.body);
    // If success, use that data for state & cache it.
    if (options.onSuccess) options.onSuccess(res.data);
    if (options.useCache) await storeJSON(options.path, res.data);
  } catch (err) {
    console.error(err);
    // If error, use the error data for state.
    options.onError(options.errorMessage);
  }

  return Promise.resolve();
};
