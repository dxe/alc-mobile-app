import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
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
