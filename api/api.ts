import axios from "axios";
import {
  getDeviceID,
  getStoredJSON,
  ONE_HOUR_MS,
  storeJSON,
  waitFunc,
} from "../util";
import { useEffect, useState, useRef } from "react";
import { AppState } from "react-native";
import * as Device from "expo-device";

export const CONFERENCE_ID = 5;
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
    await axios.post(BASE_URL + options.path, {
      ...options.body,
      device_id: deviceID,
    });
    return Promise.resolve();
  } catch (err) {
    console.error(err);
    return Promise.reject();
  }
};

export const useAPI = (options: APIOptions) => {
  const [data, setData] = useState(options.initialValue);
  const [status, setStatus] = useState("initialized");
  const appState = useRef(AppState.currentState);

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
          axios.post(BASE_URL + options.path, {
            ...options.body,
            device_id: deviceID,
          }),
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
  // This is pointless unless the app is kept in the foreground
  // b/c the interval will pause when app is backgrounded.
  useEffect(() => {
    if (Device.brand !== "Apple") return; // Android doesn't like long running interval timers

    const interval = setInterval(() => {
      setStatus("refreshing");
    }, ONE_HOUR_MS);

    return () => clearInterval(interval);
  }, [options.path]);

  // Monitor the AppState (foreground, background, inactive).
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // When AppState moves to foreground, refresh the data.
  // This will prevent stale data if users keep the app in the
  // background but never fully close it.
  const _handleAppStateChange = (nextAppState: any) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // AppState has change to the foreground.
      setStatus("refreshing");
    }
    appState.current = nextAppState;
  };

  return { data, setData, status, setStatus };
};
