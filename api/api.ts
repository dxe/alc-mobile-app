import axios from "axios";
import { getStoredJSON, storeJSON } from "../util";
import { Dispatch } from "react";

export const CONFERENCE_ID = 1;
export const BASE_URL = "https://alc-mobile-api.dxe.io/api";

interface APIOptions {
  // the request path
  path: string;
  // the request body
  body: {};
  // a function to pass the response data to on success
  onSuccess: Dispatch<any>;
  // a function to pass the error message to on failure
  onError: Dispatch<any>;
  // the error message to pass to onError
  errorMessage: string;
  // the data to pass to onSuccess if the cache is empty
  fallback: any;
}

export const callAPIUsingCache = async function (options: APIOptions): Promise<void> {
  // First use the cached data if it exists
  options.onSuccess((await getStoredJSON(options.path)) || options.fallback);

  // Then try to fetch data from the server.
  try {
    console.log(`fetching: ${options.path}`); // TODO: remove after debugging
    const res = await axios.post(BASE_URL + options.path, options.body);
    // If success, use that data for state & cache it.
    options.onSuccess(res.data);
    await storeJSON(options.path, res.data);
  } catch (err) {
    console.error(err);
    // If error, use the error data for state.
    options.onError(options.errorMessage);
  }

  return Promise.resolve();
};
