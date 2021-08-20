import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStoredJSON, showErrorMessage, utcToLocal } from "../util";
import { Icon } from "react-native-elements";
import { figmaColors, figmaStyles } from "../global-styles";
import { ConferenceEvent, postRSVP } from "../api/schedule";
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
                const totalAttendees = !scheduleItem.attending
                  ? scheduleItem.total_attendees + 1
                  : scheduleItem.total_attendees - 1;
                return {
                  ...event,
                  attending: !scheduleItem.attending,
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
            <View style={{ flex: 1, flexDirection: "row", marginBottom: 12 }}>
              <Text style={figmaStyles.textSmallMedium}>{utcToLocal(props.event.start_time).format("h:mm A")}</Text>
              <Text style={[figmaStyles.textSmallMedium, { color: figmaColors.mediumGrey }]}>
                {"  –  " + utcToLocal(props.event.start_time).add(props.event.length, "minute").format("h:mm A")}
              </Text>
            </View>
            <Text style={[figmaStyles.textLargeSemiBold, { marginBottom: 2, marginRight: 12 }]}>
              {props.event.name}
            </Text>
            <Text style={figmaStyles.textMediumRegular}>{props.event.location.name}</Text>
          </View>
          <TouchableOpacity onPress={eventRSVP} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator
                size="small"
                color={figmaColors.purple}
                style={{ padding: 10, borderWidth: 2, borderRadius: 100, borderColor: figmaColors.purple }}
              />
            ) : (
              <Icon
                type="font-awesome-5"
                raised
                reverse={scheduleItem.attending}
                name={scheduleItem.attending ? "check" : "plus"}
                color={scheduleItem.attending ? figmaColors.purple : figmaColors.purple}
                containerStyle={{
                  margin: 0,
                  borderWidth: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: figmaColors.purple,
                }}
                size={20}
                disabled={submitting}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
