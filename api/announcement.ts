import { CONFERENCE_ID, callAPIUsingCache } from "./api";
import { Dispatch } from "react";

export interface Announcement {
  id: number;
  icon: string;
  title: string;
  send_time: string; // TODO: use Date instead?
  message: string;
}

export const getAnnouncements = function (
  onSuccess: Dispatch<Announcement[]>,
  onError: Dispatch<string>
): Promise<void> {
  const options = {
    path: "/announcement/list",
    body: {
      conference_id: CONFERENCE_ID,
    },
    onSuccess: onSuccess,
    onError: onError,
    errorMessage: "Unable to retrieve latest announcements.",
    fallback: [],
  };
  return callAPIUsingCache(options);
};
