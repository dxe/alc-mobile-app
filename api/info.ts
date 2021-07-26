import { callAPIUsingCache } from "./api";
import { Dispatch } from "react";

export interface Info {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  content: string;
}

export const getInfo = function (onSuccess: Dispatch<Info[]>, onError: Dispatch<string>): Promise<void> {
  const options = {
    path: "/info/list",
    body: {},
    onSuccess: onSuccess,
    onError: onError,
    errorMessage: "Unable to retrieve latest information.",
    fallback: [],
  };
  return callAPIUsingCache(options);
};
