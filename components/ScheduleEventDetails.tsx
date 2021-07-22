import { ConferenceEvent } from "../api/schedule";
import { Button, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, globalStyles } from "../global-styles";
import moment from "moment";
import { utcToLocal } from "../util";
import MapView, { Marker } from "react-native-maps";
import { showLocation } from "react-native-map-link";
import React from "react";

export function ScheduleEventDetails({ route }: any) {
  const { scheduleItem }: { scheduleItem: ConferenceEvent } = route.params;

  return (
    // TODO: improve the Event Details screen.
    <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.scrollViewContentContainer}>
      <Text style={{ fontWeight: "bold", fontSize: 26, paddingTop: 16 }}>{scheduleItem.name}</Text>
      <Text style={{ paddingTop: 5 }}>{moment(scheduleItem.start_time).format("dddd, MMMM D")}</Text>
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
      <Button
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
        color={colors.primary}
      />
      <Text style={{ paddingTop: 10 }}>Attending: {scheduleItem.total_attendees}</Text>
      <Text>RSVP BUTTON</Text>
      <Text style={{ fontWeight: "bold", fontSize: 18, paddingTop: 10 }}>Description</Text>
      <Text>{scheduleItem.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width - 20,
    height: 200,
  },
});
