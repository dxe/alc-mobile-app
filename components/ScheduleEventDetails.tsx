import { ConferenceEvent, postRSVP } from "../api/schedule";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, globalStyles, newColors } from "../global-styles";
import { logAnalyticsEvent, showErrorMessage, utcToLocal } from "../util";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { showLocation } from "react-native-map-link";
import React, { useContext, useState } from "react";
import { Button, Icon } from "react-native-elements";
import { ScheduleContext } from "../ScheduleContext";
import * as Device from "expo-device";

export function ScheduleEventDetails({ route }: any) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [scheduleItem, setScheduleItem] = useState<ConferenceEvent>(
    route.params.scheduleItem
  );
  const { setData } = useContext(ScheduleContext);

  // TODO: refactor this into the postRSVP function to reduce duplication of code?
  const eventRSVP = () => {
    setSubmitting(true);
    logAnalyticsEvent(
      "LargeRSVPButtonTapped",
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
    <ScrollView
      style={[{ backgroundColor: newColors.mediumGrey }]}
      contentContainerStyle={[{ paddingVertical: 24, paddingHorizontal: 16 }]}
    >
      <Text style={[globalStyles.h1, { marginBottom: 5 }]}>
        {scheduleItem.name}
      </Text>
      <Text style={globalStyles.textMediumMedium}>
        {utcToLocal(scheduleItem.start_time).format("dddd, MMMM D")}
      </Text>
      <Text style={globalStyles.textMediumMedium}>
        {utcToLocal(scheduleItem.start_time).format("h:mm A")} -&nbsp;
        {utcToLocal(scheduleItem.start_time)
          .add(scheduleItem.length, "minute")
          .format("h:mm A")}
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
            onPress={() => {
              logAnalyticsEvent(
                "MapTapped",
                scheduleItem.id,
                scheduleItem.name
              );
              showLocation({
                latitude: scheduleItem.location.lat,
                longitude: scheduleItem.location.lng,
                title: scheduleItem.location.name,
                googleForceLatLon: true, // force Google Maps to use the coords for the query instead of the title
                googlePlaceId: scheduleItem.location.place_id,
                alwaysIncludeGoogle: true,
              });
            }}
            mapType={"mutedStandard"}
            zoomEnabled={false}
            scrollEnabled={false}
            initialRegion={{
              latitude: scheduleItem.location.lat,
              longitude: scheduleItem.location.lng,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            }}
            provider={
              Device.brand === "Apple" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE
            }
          >
            <Marker
              key={scheduleItem.id}
              coordinate={{
                latitude: scheduleItem.location.lat,
                longitude: scheduleItem.location.lng,
              }}
              title={scheduleItem.location.name}
              description={
                scheduleItem.location.address +
                ", " +
                scheduleItem.location.city
              }
            />
          </MapView>
        </View>
        {/* Address & directions */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: newColors.darkGrey,
            borderRadius: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: colors.midGrey,
                padding: 8,
                backgroundColor: newColors.darkGrey,
              }}
            >
              <Text style={globalStyles.textBodyMedium}>
                {scheduleItem.location.name}
              </Text>
              <Text style={globalStyles.textBody} selectable={true}>
                {scheduleItem.location.address +
                  ", " +
                  scheduleItem.location.city}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                padding: 14,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  logAnalyticsEvent(
                    "GetDirectionsTapped",
                    scheduleItem.id,
                    scheduleItem.name
                  );
                  showLocation({
                    latitude: scheduleItem.location.lat,
                    longitude: scheduleItem.location.lng,
                    title: scheduleItem.location.name,
                    googleForceLatLon: true, // force Google Maps to use the coords for the query instead of the title
                    googlePlaceId: scheduleItem.location.place_id,
                    alwaysIncludeGoogle: true,
                  });
                }}
              >
                <Icon
                  name={"directions"}
                  type={"font-awesome-5"}
                  style={{ marginRight: 7 }}
                  color={colors.primary}
                />
                <Text style={globalStyles.textButton}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, flexDirection: "row", marginBottom: 16 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Icon
            type="font-awesome-5"
            name="calendar-check"
            color={colors.primary}
            size={25}
          />
          <Text
            style={[
              globalStyles.textMediumRegular,
              { alignSelf: "center", paddingLeft: 10 },
            ]}
          >
            {scheduleItem.total_attendees} confirmed attendees
          </Text>
        </View>
        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            paddingLeft: 25,
          }}
        >
          <Button
            titleStyle={
              scheduleItem.attending
                ? [globalStyles.textButton, { color: colors.white }]
                : globalStyles.textButton
            }
            buttonStyle={[
              scheduleItem.attending
                ? globalStyles.buttonPrimary
                : globalStyles.buttonPrimaryOutline,
              { flex: 1 },
            ]}
            disabledTitleStyle={[
              globalStyles.textButton,
              { color: colors.white },
            ]}
            disabledStyle={[globalStyles.buttonPrimaryOutline, { flex: 1 }]}
            onPress={eventRSVP}
            icon={
              submitting ? undefined : (
                <Icon
                  name={scheduleItem.attending ? "check" : "plus"}
                  type="font-awesome-5"
                  color={scheduleItem.attending ? colors.white : colors.primary}
                  size={16}
                />
              )
            }
            title={
              submitting ? (
                <ActivityIndicator size="small" color={colors.primary} />
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
          <Text style={[globalStyles.textLargeSemiBold, { marginBottom: 5 }]}>
            Description
          </Text>
          <Text style={globalStyles.textBody}>
            {scheduleItem.description.trim()}
          </Text>
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
