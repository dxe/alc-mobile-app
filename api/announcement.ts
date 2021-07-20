import { APIResponse, CONFERENCE_ID, post } from "./api";

export interface Announcement {
  id: number;
  icon: string;
  title: string;
  timestamp: string; // TODO: use Date instead?
  message: string;
}

export const getAnnouncements = async function (): Promise<APIResponse> {
  const options = {
    path: "/announcement/list",
    body: {
      conference_id: CONFERENCE_ID,
    },
  };
  return post(options);
};
