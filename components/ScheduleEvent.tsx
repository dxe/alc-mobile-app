import React, { Dispatch } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { utcToLocal } from "../util";
import { ListItem } from "react-native-elements";
import { colors, globalStyles } from "../global-styles";
import FeatherIcon from "react-native-vector-icons/Feather";
import { ConferenceEvent, Schedule } from "../api/schedule";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationProp } from "@react-navigation/native";

interface Props {
  event: ConferenceEvent;
  nav: NavigationProp<any>;
}

export function ScheduleEvent(props: Props) {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
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
            <View
              style={[
                styles.rsvpStatus,
                { backgroundColor: props.event.attending ? colors.lightgreen : colors.lightred },
              ]}
            >
              <Text style={styles.rsvpStatusText}>{props.event.attending ? "Attending" : "Not attending"}</Text>
            </View>
          </View>
          <Pressable
            onPress={() =>
              props.nav.navigate("Event Details", {
                scheduleItem: props.event as ConferenceEvent,
              })
            }
          >
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
          </Pressable>
        </View>
      </View>
    </View>
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
