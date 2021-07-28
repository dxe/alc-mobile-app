import { CONFERENCE_ID, postAPI, useAPI } from "./api";

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

export interface RSVP {
  event_id: number;
  attending: boolean;
}

export const useSchedule = (initialValue: any) => {
  return useAPI({
    path: "/event/list",
    body: {
      conference_id: CONFERENCE_ID,
    },
    initialValue: initialValue,
  });
};

export const postRSVP = (data: RSVP) => {
  return postAPI({
    path: "/event/rsvp",
    body: data,
  });
};
