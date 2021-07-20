import { APIResponse, CONFERENCE_ID, post } from "./api";

export interface Conference {
  id: number;
  name: string;
  start_date: string; // TODO: use Date?
  end_date: string; // TODO: use Date?
}

export const getConferences = async function (): Promise<APIResponse> {
  const options = {
    path: "/conference/list",
    body: {
      conference_id: CONFERENCE_ID,
    },
  };
  return post(options);
};
