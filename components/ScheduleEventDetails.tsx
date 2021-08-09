import { Attendee, ConferenceEvent, postRSVP } from "../api/schedule";
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, globalStyles } from "../global-styles";
import { getStoredJSON, showErrorMessage, utcToLocal } from "../util";
import MapView, { Marker } from "react-native-maps";
import { showLocation } from "react-native-map-link";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-native-elements";
import { ScheduleContext } from "../ScheduleContext";
import Ionicons from "react-native-vector-icons/Ionicons";

export function ScheduleEventDetails({ route }: any) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [scheduleItem, setScheduleItem] = useState<ConferenceEvent>(route.params.scheduleItem);
  const [error, setError] = useState<string>("");
  const { setData } = useContext(ScheduleContext);

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
                console.log(`setting ATTENDING to ${!scheduleItem.attending}`);
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

  useEffect(() => {
    if (error === "") return;
    showErrorMessage(error);
    setSubmitting(false);
    setError("");
  }, [error]);

  return (
    // TODO: improve the Event Details screen.
    <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.scrollViewContentContainer}>
      <Text style={{ fontWeight: "bold", fontSize: 26, paddingTop: 16 }}>{scheduleItem.name}</Text>
      <Text style={{ paddingTop: 5 }}>{utcToLocal(scheduleItem.start_time).format("dddd, MMMM D")}</Text>
      <Text>
        {utcToLocal(scheduleItem.start_time).format("h:mm A")} -&nbsp;
        {utcToLocal(scheduleItem.start_time).add(scheduleItem.length, "minute").format("h:mm A")}
      </Text>
      <View
        style={{
          marginVertical: 12,
          backgroundColor: colors.white,
          borderWidth: 0,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 7,
        }}
      >
        <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: "hidden" }}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: scheduleItem.location.lat,
              longitude: scheduleItem.location.lng,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            }}
          >
            <Marker
              key={scheduleItem.id}
              coordinate={{ latitude: scheduleItem.location.lat, longitude: scheduleItem.location.lng }}
              title={scheduleItem.location.name}
              description={scheduleItem.location.address + ", " + scheduleItem.location.city}
            />
          </MapView>
        </View>
        <View style={{ padding: 5, paddingLeft: 10, flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontWeight: "bold" }}>{scheduleItem.location.name}</Text>
            <Text>{scheduleItem.location.address + ", " + scheduleItem.location.city}</Text>
            <TouchableOpacity
              style={{ paddingTop: 5 }}
              onPress={() => {
                showLocation({
                  latitude: scheduleItem.location.lat,
                  longitude: scheduleItem.location.lng,
                  title: scheduleItem.location.name,
                  googleForceLatLon: true, // force Google Maps to use the coords for the query instead of the title
                  googlePlaceId: scheduleItem.location.place_id,
                });
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: "bold" }}>Get directions</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignSelf: "center" }}>
            <Button
              titleStyle={{ color: colors.white, fontWeight: "bold", fontSize: 16 }}
              buttonStyle={[
                globalStyles.buttonPrimary,
                { backgroundColor: scheduleItem.attending ? colors.lightgreen : colors.lightred, flex: 1 },
              ]}
              onPress={eventRSVP}
              title={scheduleItem.attending ? "Attending" : "Not attending"}
              disabled={submitting}
            />
          </View>
        </View>
      </View>

      {scheduleItem.attendees && scheduleItem.attendees.length > 0 && (
        <View style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
          <Ionicons name="checkmark-circle" size={30} />
          <Text style={{ alignSelf: "center", paddingLeft: 5 }}>
            {scheduleItem.total_attendees} confirmed attendees
          </Text>
        </View>
      )}

      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Description</Text>
      <Text>{scheduleItem.description}</Text>
      {scheduleItem.attendees &&
        scheduleItem.attendees.length > 0 &&
        scheduleItem.attendees.filter((attendee) => attendee.name !== "").length > 0 && (
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 18, paddingTop: 20 }}>RSVP List</Text>
            {/*TODO: update immediately when RSVP button is pressed*/}
            {scheduleItem.attendees !== null &&
              scheduleItem.attendees
                .filter((attendee) => attendee.name !== "")
                .map((attendee, index) => (
                  <View key={index}>
                    <Text>{attendee.name}</Text>
                  </View>
                ))}
            {scheduleItem.attendees.filter((attendee) => attendee.name === "").length > 0 && (
              <Text>+{scheduleItem.attendees.filter((attendee) => attendee.name === "").length} others</Text>
            )}
          </View>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 150,
  },
});
