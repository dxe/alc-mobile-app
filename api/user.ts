import { postAPI } from "./api";

export interface User {
  conference_id?: number;
  name?: string;
  email?: string;
  device_name?: string;
  platform?: string;
  expo_push_token?: string;
}

export const postAddUser = (data: User) => {
  return postAPI({
    path: "/user/add",
    body: data,
  });
};

export const postRegisterPushNotifications = (data: User) => {
  return postAPI({
    path: "/user/register_push_notifications",
    body: data,
  });
};
