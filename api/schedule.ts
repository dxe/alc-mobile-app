import { CONFERENCE_ID, postAPI, useAPI } from "./api";
import { logAnalyticsEvent } from "../util";

export interface Schedule {
  events: ConferenceEvent[];
  conference: Conference;
}

export interface Conference {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

export interface ConferenceEvent {
  attending: boolean;
  description: string;
  id: number;
  image_url: string | null;
  key_event: boolean;
  breakout_session: boolean;
  length: number;
  location: Location;
  name: string;
  start_time: string;
  total_attendees: number;
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

export const postRSVP = async (data: RSVP, setScheduleData: any, setScheduleItem: any): Promise<any> => {
  await postAPI({
    path: "/event/rsvp",
    body: data,
  });
  // update rsvp status in context
  setScheduleData((prev: any) => {
    return {
      ...prev,
      events: prev.events.map((event: any) => {
        if (event.id === data.event_id) {
          const totalAttendees = !event.attending ? event.total_attendees + 1 : event.total_attendees - 1;
          return {
            ...event,
            attending: !event.attending,
            total_attendees: totalAttendees,
          };
        }
        return event;
      }),
    };
  });
  // update state in this component
  setScheduleItem((prevState: ConferenceEvent) => {
    const totalAttendees = !prevState.attending ? prevState.total_attendees + 1 : prevState.total_attendees - 1;
    return {
      ...prevState,
      attending: !prevState.attending,
      total_attendees: totalAttendees,
    };
  });
  return Promise.resolve();
};
