import { ConferenceEvent, postRSVP } from "../api/schedule";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, globalStyles } from "../global-styles";
import { showErrorMessage, utcToLocal } from "../util";
import MapView, { Marker } from "react-native-maps";
import { showLocation } from "react-native-map-link";
import React, { useEffect, useState } from "react";
import { Button } from "react-native-elements";

export function ScheduleEventDetails({ route }: any) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [scheduleItem, setScheduleItem] = useState<ConferenceEvent>(route.params.scheduleItem);
  const [error, setError] = useState<string>("");

  const rsvpSuccess = () => {
    setScheduleItem({
      ...scheduleItem,
      total_attendees: scheduleItem.attending ? scheduleItem.total_attendees - 1 : scheduleItem.total_attendees + 1,
      attending: !scheduleItem.attending,
    });
    // Update state in the parent component.
    route.params.setRSVP(!scheduleItem.attending);
  };

  useEffect(() => {
    if (error === "") return;
    showErrorMessage(error);
    setSubmitting(false);
    setError("");
  }, [error]);

  const eventRSVP = () => {
    setSubmitting(true);
    (async () => {
      try {
        await postRSVP({
          attending: !scheduleItem.attending,
          event_id: scheduleItem.id,
        });
        rsvpSuccess();
      } catch (e) {
        setError("Failed to RSVP.");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    // TODO: improve the Event Details screen.
    <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.scrollViewContentContainer}>
      <Text style={{ fontWeight: "bold", fontSize: 26, paddingTop: 16 }}>{scheduleItem.name}</Text>
      <Text style={{ paddingTop: 5 }}>{utcToLocal(scheduleItem.start_time).format("dddd, MMMM D")}</Text>
      <Text>
        {utcToLocal(scheduleItem.start_time).format("h:mm A")} -&nbsp;
        {utcToLocal(scheduleItem.start_time).add(scheduleItem.length, "minute").format("h:mm A")}
      </Text>
      <View style={{ paddingTop: 12 }}>
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
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", marginTop: 5 }}>
        <Button
          titleStyle={{ color: colors.primary, fontWeight: "bold" }}
          buttonStyle={[globalStyles.buttonWhite]}
          onPress={() => {
            showLocation({
              latitude: scheduleItem.location.lat,
              longitude: scheduleItem.location.lng,
              title: scheduleItem.location.name,
              googleForceLatLon: true, // force Google Maps to use the coords for the query instead of the title
              googlePlaceId: scheduleItem.location.place_id,
            });
          }}
          title="Get directions"
        />
        {/*Note that we are currently not showing the RSVP button if the user got to the */}
        {/*  Event Details screen from the Home screen. This is because there is no easy*/}
        {/*  way currently to update the RSVP status in the state of the Schedule component.*/}
        {route.params.setRSVP && (
          <Button
            titleStyle={{ color: colors.white, fontWeight: "bold" }}
            buttonStyle={[
              globalStyles.buttonPrimary,
              { backgroundColor: scheduleItem.attending ? colors.lightred : colors.lightgreen, flex: 1 },
            ]}
            onPress={eventRSVP}
            title={scheduleItem.attending ? "Cancel RSVP" : "RSVP"}
            disabled={submitting}
          />
        )}
      </View>
      <Text style={{ fontWeight: "bold", fontSize: 18, paddingTop: 20 }}>Description</Text>
      <Text>{scheduleItem.description}</Text>
      {/*Note that we are currently not showing the attendee list if the user got to the */}
      {/*  Event Details screen from the Home screen. This is because there is no easy*/}
      {/*  way currently to update the attendee list in the state of the Schedule component.*/}
      {route.params.setRSVP && (
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18, paddingTop: 20 }}>RSVP List</Text>
          {/*TODO: show list of rsvps that updates immediately when RSVP button is pressed*/}
          <Text>{scheduleItem.total_attendees} attendees</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width - 20,
    height: 200,
  },
});
