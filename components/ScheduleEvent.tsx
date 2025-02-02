import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import {
  logAnalyticsEvent,
  showErrorMessage,
  useCurrentTime,
  utcToLocal,
} from "../util";
import { Icon } from "@rneui/base";
import { colors, globalStyles } from "../global-styles";
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
  const { setData } = useContext(ScheduleContext);
  const currentTime = useCurrentTime();
  const endTime = utcToLocal(props.event.start_time).add(
    props.event.length,
    "minute"
  );

  // Update this component's state whenever the prop gets updated (via Context).
  useEffect(() => {
    setScheduleItem(props.event);
  }, [props.event]);

  // TODO: refactor this into the postRSVP function to reduce duplication of code?
  const eventRSVP = () => {
    setSubmitting(true);
    logAnalyticsEvent(
      "SmallRSVPButtonTapped",
      scheduleItem.id,
      scheduleItem.name
    );
    (async () => {
      try {
        await postRSVP(
          {
            attending: !scheduleItem.attending,
            event_id: scheduleItem.id,
          },
          setData,
          setScheduleItem
        );
      } catch (e) {
        showErrorMessage("Failed to RSVP.");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <TouchableOpacity
      onPress={() => {
        logAnalyticsEvent(
          "ScheduleEventTapped",
          scheduleItem.id,
          scheduleItem.name
        );
        props.nav.navigate("Event Details", {
          scheduleItem: scheduleItem as ConferenceEvent,
        });
      }}
      style={{ flex: 1, flexDirection: "row" }}
    >
      <View
        style={{
          flexGrow: 1,
          opacity: currentTime.isAfter(endTime) ? 0.75 : 1.0,
        }}
      >
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
              <Text style={globalStyles.textSmallMedium}>
                {utcToLocal(props.event.start_time).format("h:mm A")}
              </Text>
              <Text style={globalStyles.textSmallMedium}>
                {"  –  " + endTime.format("h:mm A")}
              </Text>
            </View>

            {props.event.key_event && (
              <Text
                style={[
                  globalStyles.textSmallBoldUppercaseOrange,
                  { marginBottom: 2 },
                ]}
              >
                Main Event
              </Text>
            )}

            {props.event.breakout_session && (
              <Text
                style={[
                  globalStyles.textSmallBoldUppercaseGreen,
                  { marginBottom: 2 },
                ]}
              >
                Breakout Session
              </Text>
            )}

            <Text
              style={[
                globalStyles.textLargeSemiBold,
                { marginBottom: 2, marginRight: 12 },
              ]}
            >
              {props.event.name}
            </Text>
            <Text style={globalStyles.textMediumRegular}>
              {props.event.location.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={eventRSVP}
            disabled={submitting}
            style={{ alignSelf: "flex-start" }}
          >
            {submitting ? (
              <ActivityIndicator
                size="small"
                color={colors.lightGreen}
                style={{
                  padding: 10,
                  borderWidth: 2,
                  borderRadius: 100,
                  borderColor: colors.lightGreen,
                }}
              />
            ) : (
              <Icon
                type="font-awesome-5"
                raised
                reverse
                name={scheduleItem.attending ? "check" : "plus"}
                color={
                  scheduleItem.attending ? colors.lightGreen : colors.darkGrey
                }
                reverseColor={
                  scheduleItem.attending ? colors.white : colors.lightGreen
                }
                containerStyle={{
                  margin: 0,
                  borderWidth: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: colors.lightGreen,
                  backgroundColor: colors.lightGreen,
                }}
                size={20}
                disabled={submitting}
              />
            )}
          </TouchableOpacity>
          <Icon
            type="font-awesome-5"
            name="angle-right"
            color={colors.lightGreen}
            containerStyle={{
              margin: 0,
              marginLeft: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
            size={20}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
