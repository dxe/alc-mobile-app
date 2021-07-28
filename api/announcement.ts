import { CONFERENCE_ID, useAPI } from "./api";

export interface Announcement {
  id: number;
  icon: string;
  title: string;
  send_time: string; // TODO: use Date instead?
  message: string;
}

export const useAnnouncements = (initialValue: any) => {
  return useAPI({
    path: "/announcement/list",
    body: {
      conference_id: CONFERENCE_ID,
    },
    initialValue: initialValue,
  });
};
