import { ConferenceEvent, postRSVP } from "../api/schedule";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, globalStyles } from "../global-styles";
import { getStoredJSON, showErrorMessage, utcToLocal } from "../util";
import MapView, { Marker } from "react-native-maps";
import { showLocation } from "react-native-map-link";
import React, { useContext, useEffect, useState } from "react";
import { Button, Icon } from "react-native-elements";
import { ScheduleContext } from "../ScheduleContext";

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

  useEffect(() => {
    if (error === "") return;
    showErrorMessage(error);
    setSubmitting(false);
    setError("");
  }, [error]);

  return (
    <ScrollView
      style={[{ backgroundColor: colors.white }]}
      contentContainerStyle={[{ paddingVertical: 24, paddingHorizontal: 16 }]}
    >
      <Text style={[globalStyles.h1, { color: colors.black, marginBottom: 5 }]}>{scheduleItem.name}</Text>
      <Text style={globalStyles.textMediumMedium}>{utcToLocal(scheduleItem.start_time).format("dddd, MMMM D")}</Text>
      <Text style={globalStyles.textMediumMedium}>
        {utcToLocal(scheduleItem.start_time).format("h:mm A")} -&nbsp;
        {utcToLocal(scheduleItem.start_time).add(scheduleItem.length, "minute").format("h:mm A")}
      </Text>

      {/* Location section */}
      <View
        style={[
          {
            marginTop: 15,
            marginBottom: 24,
            backgroundColor: colors.white,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.midGrey,
          },
          globalStyles.shadow,
        ]}
      >
        {/* Map wrapper */}
        <View
          style={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            overflow: "hidden",
            borderBottomWidth: 1,
            borderColor: colors.midGrey,
          }}
        >
          <MapView
            style={styles.map}
            onPress={() =>
              showLocation({
                latitude: scheduleItem.location.lat,
                longitude: scheduleItem.location.lng,
                title: scheduleItem.location.name,
                googleForceLatLon: true, // force Google Maps to use the coords for the query instead of the title
                googlePlaceId: scheduleItem.location.place_id,
              })
            }
            mapType={"mutedStandard"}
            zoomEnabled={false}
            scrollEnabled={false}
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
        {/* Address & directions */}
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <View style={{ borderBottomWidth: 1, borderColor: colors.midGrey, padding: 8 }}>
              <Text style={globalStyles.textBodyMedium}>{scheduleItem.location.name}</Text>
              <Text style={globalStyles.textBody} selectable={true}>
                {scheduleItem.location.address + ", " + scheduleItem.location.city}
              </Text>
            </View>
            <View style={{ flex: 1, padding: 14 }}>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
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
                <Icon name={"directions"} type={"font-awesome-5"} style={{ marginRight: 7 }} color={colors.purple} />
                <Text style={globalStyles.textButton}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, flexDirection: "row", marginBottom: 16 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Icon type="font-awesome-5" name="calendar-check" color={colors.purple} size={25} />
          <Text style={[globalStyles.textMediumRegular, { alignSelf: "center", paddingLeft: 10 }]}>
            {scheduleItem.total_attendees} confirmed attendees
          </Text>
        </View>
        <View style={{ alignSelf: "center", justifyContent: "center" }}>
          <Button
            titleStyle={
              scheduleItem.attending ? [globalStyles.textButton, { color: colors.white }] : globalStyles.textButton
            }
            buttonStyle={[
              scheduleItem.attending ? globalStyles.buttonPurple : globalStyles.buttonPurpleOutline,
              { flex: 1 },
            ]}
            onPress={eventRSVP}
            icon={
              submitting ? (
                <></>
              ) : (
                <Icon
                  name={scheduleItem.attending ? "check" : "plus"}
                  type="font-awesome-5"
                  color={scheduleItem.attending ? colors.white : colors.purple}
                  size={16}
                />
              )
            }
            title={
              submitting ? (
                <ActivityIndicator size="small" color={colors.purple} />
              ) : scheduleItem.attending ? (
                "  Attending"
              ) : (
                "  RSVP"
              )
            }
            disabled={submitting}
          />
        </View>
      </View>

      {scheduleItem.description.trim() != "" && (
        <View style={{ marginBottom: 16 }}>
          <Text style={[globalStyles.textLargeSemiBold, { marginBottom: 5 }]}>Description</Text>
          <Text style={globalStyles.textBody}>{scheduleItem.description.trim()}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 175,
  },
});
