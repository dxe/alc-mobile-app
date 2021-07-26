import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import * as Application from "expo-application";

export const ONE_HOUR_MS = 1000 * 60 * 60;

export const wait = (timeout: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const DEFAULT_TIMEOUT = 750;

// waitFunc wraps an async function and causes it to take at least a certain amount of time to resolve.
// This is used to improve the UX in case something loads so quickly that the user thinks nothing happened.
export const waitFunc = async (fn: Promise<any>, timeout: number = DEFAULT_TIMEOUT): Promise<any> => {
  const [value] = await Promise.all([fn, wait(timeout)]);
  return value;
};

export const utcToLocal = (date: string | undefined): moment.Moment => {
  if (date) {
    return moment(date).utc(true).local();
  }
  return moment().utc(true).local();
};

export const storeJSON = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`stored ${key} data`); // TODO: remove after debugging
  } catch (e) {
    console.error("error storing json data");
  }
};

export const getStoredJSON = async (key: string): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    console.log(`read ${key} data from local storage`); // TODO: remove after debugging
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("error reading stored json data");
  }
};

export const showErrorMessage = (message: string) => {
  showMessage({
    message: "Error",
    description: message,
    type: "danger",
  });
};

export const getDeviceID = async () => {
  return Application.androidId ? Promise.resolve(Application.androidId) : await Application.getIosIdForVendorAsync();
};
