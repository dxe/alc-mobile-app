import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { colors, screenHeaderOptions, globalStyles } from "../global-styles";
import { Card } from "react-native-elements";
import { showErrorMessage } from "../util";
import { FALLBACK_IMAGE, TripleTextCard } from "./common/TripleTextCard";
import { ScheduleEventDetails } from "./ScheduleEventDetails";
import { ConferenceEvent, useSchedule } from "../api/schedule";
import { TimeAgo } from "./common/TimeAgo";
import moment from "moment";

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
        }}
      />
      <Stack.Screen
        name="Event Details"
        component={ScheduleEventDetails}
        options={{
          ...screenHeaderOptions,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({ navigation }: any) {
  const { data, status, setStatus } = useSchedule(null);
  const [currentTime, setCurrentTime] = useState<moment.Moment>(moment());
  const [currentEvents, setCurrentEvents] = useState<ConferenceEvent[]>([] as ConferenceEvent[]);
  const [nextEvents, setNextEvents] = useState<ConferenceEvent[]>([] as ConferenceEvent[]);

  useEffect(() => {
    if (status != "error") return;
    showErrorMessage("Failed to get latest schedule from server.");
  }, [status]);

  // Update displayed current & next events.
  useEffect(() => {
    const updateFeaturedEvents = () => {
      if (!data) return;

      // Find the events that are happening next.
      const nextStartTime = data.events
        .filter((x: ConferenceEvent) => {
          return moment(x.start_time).utc(true).isAfter(moment());
        })
        .sort((a: ConferenceEvent, b: ConferenceEvent) => {
          return moment(a.start_time).utc(true).isAfter(moment(b.start_time).utc(true)) ? 1 : -1;
        })[0].start_time;

      setNextEvents(
        data.events.filter((x: ConferenceEvent) => {
          return x.start_time === nextStartTime;
        })
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
            return moment(x.start_time).utc(true).add(x.length, "minute").isAfter(currentTime);
          })
      );
    };
    updateFeaturedEvents();

    const interval = setInterval(() => {
      setCurrentTime(moment().utc());
      //console.log(`Current time: ${currentTime.toISOString()}`); // TODO: remove after debugging
      updateFeaturedEvents();
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTime, data]);

  return (
    data && (
      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollViewContentContainer}
        refreshControl={
          <RefreshControl refreshing={status === "refreshing"} onRefresh={() => setStatus("refreshing")} />
        }
      >
        {currentEvents && currentEvents.length > 0 && (
          <View>
            <Text style={styles.heading}>Happening now</Text>

            {currentEvents.map((e: ConferenceEvent) => {
              return (
                <Pressable
                  key={e.id}
                  onPress={() => navigation.navigate("Event Details", { scheduleItem: e as ConferenceEvent })}
                >
                  <TripleTextCard
                    imageSource={e.image_url}
                    topText={e.name}
                    middleText={e.location.name + ", " + e.location.city}
                    bottomElement={
                      <TimeAgo time={moment(e.start_time).utc(true).local().toISOString()} pretext="Started " />
                    }
                  />
                </Pressable>
              );
            })}
          </View>
        )}

        {nextEvents && nextEvents.length > 0 && (
          <View>
            <Text style={styles.heading}>Coming up next</Text>

            {nextEvents.map((e: ConferenceEvent) => {
              return (
                <TouchableOpacity
                  key={e.id}
                  onPress={() => navigation.navigate("Event Details", { scheduleItem: e as ConferenceEvent })}
                >
                  <TripleTextCard
                    imageSource={e.image_url}
                    topText={e.name}
                    middleText={e.location.name + ", " + e.location.city}
                    bottomElement={
                      <TimeAgo time={moment(e.start_time).utc(true).local().toISOString()} pretext="Starts in " />
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={styles.heading}>Key events</Text>

        <View style={styles.keyEventsView}>
          {data.events
            .filter((e: ConferenceEvent) => {
              return e.key_event;
            })
            .map((e: ConferenceEvent) => {
              return (
                <Card key={e.id} containerStyle={styles.keyEventCard}>
                  <TouchableOpacity onPress={() => navigation.navigate("Event Details", { scheduleItem: e })}>
                    <ImageBackground
                      style={styles.imageBackground}
                      imageStyle={styles.image}
                      source={{ uri: e.image_url || FALLBACK_IMAGE }}
                    />
                    <View style={styles.keyEventView}>
                      <View style={styles.keyEventInnerView}>
                        <Text style={styles.keyEventText}>{e.name}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>
              );
            })}
        </View>
      </ScrollView>
    )
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    paddingTop: 5,
    paddingBottom: 15,
  },
  keyEventsView: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  keyEventCard: {
    width: "49%",
    height: 125,
    borderRadius: 15,
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    padding: 0,
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
    borderRadius: 15,
  },
  keyEventView: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: "rgba(42,34,157,0.8)",
  },
  keyEventInnerView: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  keyEventText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    padding: 10,
  },
});
