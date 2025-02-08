import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from "react-native";
import { screenHeaderOptions, globalStyles, colors } from "../global-styles";
import {
  logAnalyticsEvent,
  showErrorMessage,
  useCurrentTime,
  utcToLocal,
} from "../util";
import { TripleTextCard } from "./common/TripleTextCard";
import { ScheduleEventDetails } from "./ScheduleEventDetails";
import { ConferenceEvent } from "../api/schedule";
import moment from "moment";
import { ScheduleContext } from "../ScheduleContext";
import Constants from "expo-constants";
import { Info } from "../api/info";
import { InfoContext } from "../InfoContext";
import { InfoDetails } from "./Info";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          ...screenHeaderOptions,
          title: "Animal Liberation Conference",
          headerTransparent: false,
          header: () => {
            return (
              <View
                style={{
                  backgroundColor: colors.darkGreen,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop:
                    Platform.OS === "ios" ? Constants.statusBarHeight : 3,
                  height:
                    Platform.OS === "ios" ? Constants.statusBarHeight + 50 : 50,
                }}
              >
                <Image
                  style={{
                    height: 55,
                    width: 55,
                    resizeMode: "contain",
                  }}
                  source={require("../assets/adaptive-icon-light.png")}
                />
              </View>
            );
          },
        }}
      />
      <Stack.Screen
        name="Event Details"
        component={ScheduleEventDetails}
        options={{
          ...screenHeaderOptions,
        }}
      />
      <Stack.Screen
        name="Info Details"
        component={InfoDetails}
        options={{
          ...screenHeaderOptions,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({ navigation }: any) {
  const [currentEvents, setCurrentEvents] = useState<ConferenceEvent[]>(
    [] as ConferenceEvent[]
  );
  const [nextEvents, setNextEvents] = useState<ConferenceEvent[]>(
    [] as ConferenceEvent[]
  );
  const [keyEvents, setKeyEvents] = useState<ConferenceEvent[]>(
    [] as ConferenceEvent[]
  );
  const { data, status, setStatus } = useContext(ScheduleContext);
  const currentTime = useCurrentTime();
  const {
    data: infoData,
    status: infoStatus,
    setStatus: setInfoStatus,
  } = useContext(InfoContext);

  useEffect(() => {
    if (status != "error") return;
    showErrorMessage("Failed to get latest schedule from server.");
  }, [status]);

  useEffect(() => {
    if (infoStatus != "error") return;
    showErrorMessage("Failed to get latest info from server.");
  }, [infoStatus]);

  const onRefresh = () => {
    setStatus("refreshing");
    setInfoStatus("refreshing");
  };

  // Update displayed current & next events.
  useEffect(() => {
    const updateFeaturedEvents = () => {
      if (!data) return;

      // Find the events that are happening next.
      const nextStartTime = data.events
        .filter((x: ConferenceEvent) => {
          return moment(x.start_time).utc(true).isAfter(moment());
        })
        .sort((a: ConferenceEvent, b: ConferenceEvent) =>
          a.start_time.localeCompare(b.start_time)
        )[0]?.start_time;

      setNextEvents(
        data.events
          .filter((x: ConferenceEvent) => {
            return x.start_time === nextStartTime;
          })
          .sort((a: ConferenceEvent, b: ConferenceEvent) =>
            a.start_time.localeCompare(b.start_time)
          )
      );

      // Find events happening now.
      setCurrentEvents(
        data.events
          .filter((x: ConferenceEvent) => {
            // First find events whose start time is before now.
            return moment(x.start_time).utc(true).isBefore(moment().utc());
          })
          .filter((x: ConferenceEvent) => {
            // Then find events that have not yet ended.
            return moment(x.start_time)
              .utc(true)
              .add(x.length, "minute")
              .isAfter(currentTime);
          })
          .sort((a: ConferenceEvent, b: ConferenceEvent) =>
            a.start_time.localeCompare(b.start_time)
          )
      );

      // Find key events happening today
      setKeyEvents(
        data.events
          .filter((x: ConferenceEvent) => {
            // First key events whose start date is today.
            return (
              x.key_event &&
              moment(moment(x.start_time).utc(true).toDate())
                .local()
                .format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
            );
          })
          .sort((a: ConferenceEvent, b: ConferenceEvent) =>
            a.start_time.localeCompare(b.start_time)
          )
      );
    };
    updateFeaturedEvents();
  }, [currentTime, data]);

  return (
    data && (
      <ScrollView
        style={[{ backgroundColor: colors.lightGreen }]}
        contentContainerStyle={[
          { paddingVertical: 16, paddingHorizontal: 16, paddingBottom: 30 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={status === "refreshing" || status === "initialized"}
            onRefresh={onRefresh}
            tintColor={colors.mediumGrey}
          />
        }
      >
        {!currentEvents.length &&
          !nextEvents.length &&
          !keyEvents.length &&
          moment().isAfter(moment(data.conference.end_date).utc(true)) && (
            <View>
              <Text
                style={[
                  globalStyles.h2,
                  { color: colors.darkGrey, marginBottom: 10 },
                ]}
              >
                {data.conference.name} has ended.
              </Text>
              <Text
                style={[
                  globalStyles.h2,
                  { color: colors.darkGrey, marginBottom: 20 },
                ]}
              >
                We hope to see you again at our next conference!
              </Text>
            </View>
          )}
        {currentEvents && currentEvents.length > 0 && (
          <View style={{ marginBottom: 26 }}>
            <Text style={[globalStyles.h1]}>Happening Now</Text>

            {currentEvents.map((e: ConferenceEvent) => {
              return (
                <TripleTextCard
                  key={e.id + "_current"}
                  navigation={navigation}
                  scheduleItem={e}
                  topElement={
                    <Text>
                      Started {moment(e.start_time).utc(true).from(currentTime)}
                    </Text>
                  }
                  middleText={e.name}
                  bottomText={e.location.name + ", " + e.location.city}
                />
              );
            })}
          </View>
        )}
        {nextEvents && nextEvents.length > 0 && (
          <View style={{ marginBottom: 26 }}>
            <Text style={globalStyles.h1}>Coming Up Next</Text>

            {nextEvents.map((e: ConferenceEvent) => {
              return (
                <TripleTextCard
                  key={e.id + "_next"}
                  navigation={navigation}
                  scheduleItem={e}
                  topElement={
                    <Text>
                      Starts {moment(e.start_time).utc(true).from(currentTime)}
                    </Text>
                  }
                  middleText={e.name}
                  bottomText={e.location.name + ", " + e.location.city}
                />
              );
            })}
          </View>
        )}
        {moment().isBefore(moment(data.conference.end_date).utc(true)) &&
          keyEvents &&
          keyEvents.length > 0 && (
            <View style={{ marginBottom: 26 }}>
              <Text style={globalStyles.h1}>Today's Main Events</Text>

              {keyEvents.map((e: ConferenceEvent) => {
                return (
                  <TripleTextCard
                    key={e.id + "_key"}
                    navigation={navigation}
                    scheduleItem={e}
                    topElement={
                      <Text>
                        <Text>{utcToLocal(e.start_time).format("h:mm A")}</Text>
                        <Text style={{ color: colors.mediumGrey }}>
                          {" – " +
                            utcToLocal(e.start_time)
                              .add(e.length, "minute")
                              .format("h:mm A")}
                        </Text>
                      </Text>
                    }
                    middleText={e.name}
                    bottomText={e.location.name + ", " + e.location.city}
                  />
                );
              })}
            </View>
          )}
        <View style={{ marginTop: 16 }}>
          {infoData
            .filter((info: Info) => info.key_info)
            .map((item: Info) => (
              <View
                key={item.id + "_info"}
                style={[
                  {
                    height: 120,
                    marginBottom: 16,
                    backgroundColor: colors.black,
                    borderRadius: 12,
                  },
                  globalStyles.shadow,
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    logAnalyticsEvent(
                      "FeaturedInfoItemTapped",
                      item.id,
                      item.title
                    );
                    navigation.navigate("Info Details", { infoItem: item });
                  }}
                >
                  <ImageBackground
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: 0,
                      position: "absolute",
                    }}
                    imageStyle={{
                      resizeMode: "cover",
                      width: "100%",
                      height: "100%",
                      padding: 0,
                      margin: 0,
                      borderRadius: 12,
                    }}
                    source={{ uri: item.image_url }}
                  />
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "#00000088",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      borderRadius: 12,
                      padding: 12,
                      borderColor: colors.white,
                      borderWidth: 1,
                    }}
                  >
                    <Text style={[globalStyles.h1, { textAlign: "center" }]}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView>
    )
  );
}
