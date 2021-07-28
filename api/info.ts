import { useAPI } from "./api";

export interface Info {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  content: string;
}

export const useInfo = (initialValue: any) => {
  return useAPI({
    path: "/info/list",
    body: {},
    initialValue: initialValue,
  });
};
