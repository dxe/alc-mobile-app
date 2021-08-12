import axios from "axios";
import { getDeviceID, getStoredJSON, ONE_HOUR_MS, storeJSON, waitFunc } from "../util";
import { useEffect, useState } from "react";

export const CONFERENCE_ID = 1;
export const BASE_URL = "https://alc-mobile-api.dxe.io/api";

interface APIOptions {
  // the request path
  path: string;
  // the request body
  body: {};
  // the initial data to use until data is successfully fetched or read from cache
  initialValue?: any;
}

export const postAPI = async function (options: APIOptions): Promise<void> {
  try {
    const deviceID = await getDeviceID();
    await axios.post(BASE_URL + options.path, { ...options.body, device_id: deviceID });
    return Promise.resolve();
  } catch (err) {
    console.error(err);
    return Promise.reject();
  }
};

// TODO: handle refreshing at intervals in here too? 1 hour?
export const useAPI = (options: APIOptions) => {
  const [data, setData] = useState(options.initialValue);
  const [status, setStatus] = useState("initialized");

  // Fetch data initially or on refresh.
  useEffect(() => {
    console.log(`STATUS: ${status}`);

    if (!options.path) return;

    if (status === "success" || status === "error") return;

    (async () => {
      const deviceID = await getDeviceID();

      // Only use the cache if the component has just been initialized,
      // since the data in state could have changed since then. (For example,
      // if someone RSVP'd to an event.)
      const cache = await getStoredJSON(options.path);
      if (cache && data === options.initialValue) setData(cache);

      try {
        const minTime = status === "refreshing" ? 500 : 0;
        const res = await waitFunc(
          axios.post(BASE_URL + options.path, { ...options.body, device_id: deviceID }),
          minTime
        );
        setStatus("success");
        console.log("fetched data from sever");
        setData(res.data);
        await storeJSON(options.path, res.data);
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    })();
  }, [options.path, status]);

  // Try to automatically refresh every hour to prevent stale data.
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus("refreshing");
    }, ONE_HOUR_MS);

    return () => clearInterval(interval);
  }, [options.path]);

  return { data, setData, status, setStatus };
};
