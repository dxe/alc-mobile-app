import { CONFERENCE_ID, callAPIUsingCache } from "./api";
import { Dispatch } from "react";

export interface Schedule {
  events: ConferenceEvent[];
  conference: Conference;
}

export interface Conference {
  id: number;
  name: string;
  start_date: string; // TODO: use Date?
  end_date: string; // TODO: use Date?
}

export interface ConferenceEvent {
  attendees: Attendee[] | null;
  attending: boolean;
  description: string;
  id: number;
  image_url: string | null;
  key_event: boolean;
  length: number;
  location: Location;
  name: string;
  start_time: string; // TODO: use Date instead?
  total_attendees: number;
}
export interface Attendee {
  name: string;
}

export interface Location {
  address: string;
  city: string;
  lat: number;
  lng: number;
  name: string;
  place_id: string;
}

export const getSchedule = function (onSuccess: Dispatch<Schedule>, onError: Dispatch<string>): Promise<void> {
  const options = {
    path: "/event/list",
    body: {
      conference_id: CONFERENCE_ID,
      user_id: null, // TODO: add user_id as a function parameter
    },
    onSuccess: onSuccess,
    onError: onError,
    errorMessage: "Unable to retrieve latest schedule.",
    fallback: null,
  };
  return callAPIUsingCache(options);
};
