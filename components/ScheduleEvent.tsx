import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStoredJSON, showErrorMessage, utcToLocal } from "../util";
import { ListItem } from "react-native-elements";
import { colors, globalStyles } from "../global-styles";
import FeatherIcon from "react-native-vector-icons/Feather";
import { ConferenceEvent, postRSVP } from "../api/schedule";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationProp } from "@react-navigation/native";
import { ScheduleContext } from "../ScheduleContext";

interface Props {
  event: ConferenceEvent;
  nav: NavigationProp<any>;
}

export function ScheduleEvent(props: Props) {
  const [scheduleItem, setScheduleItem] = useState(props.event);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { setData } = useContext(ScheduleContext);

  useEffect(() => {
    if (error === "") return;
    showErrorMessage(error);
    setSubmitting(false);
    setError("");
  }, [error]);

  // Update this component's state whenever the prop gets updated (via Context).
  useEffect(() => {
    setScheduleItem(props.event);
  }, [props.event]);

  // TODO: refactor this into the postRSVP function to reduce duplication of code?
  const eventRSVP = () => {
    setSubmitting(true);
    (async () => {
      try {
        await postRSVP({
          attending: !scheduleItem.attending,
          event_id: scheduleItem.id,
        });
        const user = await getStoredJSON("user");
        // update rsvp status in context
        setData((prev: any) => {
          return {
            ...prev,
            events: prev.events.map((event: any) => {
              if (event.id === scheduleItem.id) {
                const attendeeIndex = scheduleItem.attendees.findIndex((x) => x.name === user.name);
                const attendees = !scheduleItem.attending
                  ? [{ name: user.name }].concat(scheduleItem.attendees)
                  : scheduleItem.attendees.filter((x, i) => i !== attendeeIndex);
                const totalAttendees = !scheduleItem.attending
                  ? scheduleItem.total_attendees + 1
                  : scheduleItem.total_attendees - 1;
                return {
                  ...event,
                  attending: !scheduleItem.attending,
                  attendees: attendees,
                  total_attendees: totalAttendees,
                };
              }
              return event;
            }),
          };
        });
        // update state in this component
        setScheduleItem((prevState: ConferenceEvent) => {
          const attendeeIndex = prevState.attendees.findIndex((x) => x.name === user.name);
          const attendees = !prevState.attending
            ? [{ name: user.name }].concat(prevState.attendees)
            : prevState.attendees.filter((x, i) => i !== attendeeIndex);
          const totalAttendees = !prevState.attending ? prevState.total_attendees + 1 : prevState.total_attendees - 1;
          return {
            ...prevState,
            attending: !prevState.attending,
            attendees: attendees,
            total_attendees: totalAttendees,
          };
        });
      } catch (e) {
        setError("Failed to RSVP.");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <TouchableOpacity
      onPress={() =>
        props.nav.navigate("Event Details", {
          scheduleItem: scheduleItem as ConferenceEvent,
        })
      }
      style={{ flex: 1, flexDirection: "row" }}
    >
      <View style={{ paddingRight: 10 }}>
        <Text style={styles.startTime}>{utcToLocal(props.event.start_time).format("h:mm A")}</Text>
        <Text style={styles.endTime}>|</Text>
        <Text style={styles.endTime}>
          {utcToLocal(props.event.start_time).add(props.event.length, "minute").format("h:mm A")}
        </Text>
      </View>
      <View style={{ flexGrow: 1 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <ListItem.Title style={[globalStyles.listItemTitle, { fontSize: 20, marginBottom: 10 }]}>
              {props.event.name}
            </ListItem.Title>
            <ListItem.Subtitle>
              <FeatherIcon name="map-pin" size={16} /> <Text style={{ fontSize: 16 }}>{props.event.location.name}</Text>
            </ListItem.Subtitle>
            <TouchableOpacity
              onPress={eventRSVP}
              disabled={submitting}
              style={[
                styles.rsvpStatus,
                { backgroundColor: scheduleItem.attending ? colors.lightgreen : colors.lightred },
              ]}
            >
              <Text style={styles.rsvpStatusText}>{scheduleItem.attending ? "Attending" : "Not attending"}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                borderRadius: 100,
                height: "100%",
              }}
            >
              <Ionicons name="caret-forward" size={30} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  startTime: { textAlign: "center", backgroundColor: colors.white, fontSize: 15, paddingTop: 3 },
  endTime: { textAlign: "center", backgroundColor: colors.white, color: colors.grey, fontSize: 15 },
  rsvpStatus: {
    padding: 10,
    marginTop: 10,
    borderRadius: 100,
  },
  rsvpStatusText: { color: colors.white, fontWeight: "bold" },
  colorPrimary: { color: colors.primary },
  colorWhite: { color: colors.white },
});
