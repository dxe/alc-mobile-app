import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import * as Application from "expo-application";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

export const ONE_HOUR_MS = 1000 * 60 * 60;

export const wait = (timeout: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const DEFAULT_TIMEOUT = 500;

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
    console.error(`error storing json data for key ${key}`);
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
  const storedUser = await getStoredJSON("user");
  const storedDeviceID = storedUser?.deviceID;
  if (storedDeviceID) return storedDeviceID;

  if (Application.androidId) {
    return Promise.resolve(Application.androidId);
  }
  const id = await Application.getIosIdForVendorAsync();
  if (id) {
    return Promise.resolve(id);
  }
  return Promise.reject();
};

// This function was adapted from: https://docs.expo.dev/push-notifications/push-notifications-setup/
export const registerForPushNotificationsAsync = async (): Promise<string> => {
  if (!Constants.isDevice) {
    alert("Must use physical device for push notifications!");
    return Promise.reject();
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get token for push notifications!");
    return Promise.reject();
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(`Got token: ${token}`);

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return Promise.resolve(token);
};

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState<moment.Moment>(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 5000);
    return () => clearInterval(interval);
  }, [currentTime]);

  return currentTime;
};
