import { APIResponse, post } from "./api";

export interface Info {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  content: string;
}

export const getInfo = async function (): Promise<APIResponse> {
  const options = {
    path: "/info/list",
    body: {},
  };
  return post(options);
};
