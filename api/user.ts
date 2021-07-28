import { postAPI } from "./api";
import { Dispatch } from "react";

export interface User {
  conference_id?: number;
  name?: string;
  email?: string;
  device_id: string;
  device_name?: string;
  platform?: string;
  expo_push_token?: string;
}

export const addUser = function (data: User, onSuccess: any, onError: Dispatch<string>): Promise<void> {
  const options = {
    path: "/user/add",
    body: data,
    onSuccess: onSuccess,
    onError: onError,
    errorMessage: "Registration failed.",
    useCache: false,
  };
  return postAPI(options);
};

export const registerPushNotifications = function (
  data: User,
  onSuccess: any,
  onError: Dispatch<string>
): Promise<void> {
  const options = {
    path: "/user/register_push_notifications",
    body: data,
    onSuccess: onSuccess,
    onError: onError,
    errorMessage: "Registration failed.",
    useCache: false,
  };
  return postAPI(options);
};
