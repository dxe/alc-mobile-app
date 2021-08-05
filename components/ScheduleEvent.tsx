import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { showErrorMessage, utcToLocal } from "../util";
import { ListItem } from "react-native-elements";
import { colors, globalStyles } from "../global-styles";
import FeatherIcon from "react-native-vector-icons/Feather";
import { ConferenceEvent, postRSVP } from "../api/schedule";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationProp } from "@react-navigation/native";

interface Props {
  event: ConferenceEvent;
  nav: NavigationProp<any>;
}

export function ScheduleEvent(props: Props) {
  // TODO: probably should put the whole event in state instead of just the rsvp status
  // so then we can easily update the attendee list & attendee count as well.
  // Be sure to also change the useEffect below that watches the props.event.attending
  // to just watch props.event instead & update the state accordingly.
  const [rsvp, setRSVP] = useState(props.event.attending);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (error === "") return;
    showErrorMessage(error);
    setSubmitting(false);
    setError("");
  }, [error]);

  // Whenever we get a new RSVP status from the server, update the RSVP status in state.
  useEffect(() => {
    setRSVP(props.event.attending);
  }, [props.event.attending]);

  const eventRSVP = () => {
    setSubmitting(true);
    (async () => {
      try {
        await postRSVP({
          attending: !rsvp,
          event_id: props.event.id,
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
          scheduleItem: { ...props.event, attending: rsvp } as ConferenceEvent,
          setRSVP: setRSVP,
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
              style={[styles.rsvpStatus, { backgroundColor: rsvp ? colors.lightgreen : colors.lightred }]}
            >
              <Text style={styles.rsvpStatusText}>{rsvp ? "Attending" : "Not attending"}</Text>
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
