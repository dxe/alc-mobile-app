import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
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
import { screenHeaderOptions, globalStyles, colors } from "../global-styles";
import { Card } from "react-native-elements";
import { showErrorMessage } from "../util";
import { TripleTextCard } from "./common/TripleTextCard";
import { ScheduleEventDetails } from "./ScheduleEventDetails";
import { ConferenceEvent } from "../api/schedule";
import { TimeAgo } from "./common/TimeAgo";
import moment from "moment";
import { ScheduleContext } from "../ScheduleContext";

// TODO: Consider storing the fallback image locally in case someone has no Internet connection.
const FALLBACK_IMAGE = "https://alc-img.s3.us-west-2.amazonaws.com/home-march.jpg.1626905834..jpg";

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
  const [currentTime, setCurrentTime] = useState<moment.Moment>(moment());
  const [currentEvents, setCurrentEvents] = useState<ConferenceEvent[]>([] as ConferenceEvent[]);
  const [nextEvents, setNextEvents] = useState<ConferenceEvent[]>([] as ConferenceEvent[]);
  const { data, status, setStatus } = useContext(ScheduleContext);

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
        .sort((a: ConferenceEvent, b: ConferenceEvent) => a.start_time.localeCompare(b.start_time))[0].start_time;

      setNextEvents(
        data.events
          .filter((x: ConferenceEvent) => {
            return x.start_time === nextStartTime;
          })
          .sort((a: ConferenceEvent, b: ConferenceEvent) => a.start_time.localeCompare(b.start_time))
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
          .sort((a: ConferenceEvent, b: ConferenceEvent) => a.start_time.localeCompare(b.start_time))
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
        style={[globalStyles.scrollView, { backgroundColor: colors.primary }]}
        contentContainerStyle={[globalStyles.scrollViewContentContainer]}
        refreshControl={
          <RefreshControl
            refreshing={status === "refreshing" || status === "initialized"}
            onRefresh={() => setStatus("refreshing")}
            tintColor={colors.white}
          />
        }
      >
        {currentEvents && currentEvents.length > 0 && (
          <View>
            <Text style={styles.heading}>Happening Now</Text>

            {currentEvents.map((e: ConferenceEvent) => {
              return (
                <Pressable
                  key={e.id}
                  onPress={() => navigation.navigate("Event Details", { scheduleItem: e as ConferenceEvent })}
                >
                  <TripleTextCard
                    bottomText={e.location.name + ", " + e.location.city}
                    topElement={
                      <TimeAgo time={moment(e.start_time).utc(true).local().toISOString()} pretext="Started " />
                    }
                    middleText={e.name}
                  />
                </Pressable>
              );
            })}
          </View>
        )}

        {nextEvents && nextEvents.length > 0 && (
          <View>
            <Text style={styles.heading}>Coming Up Next</Text>

            {nextEvents.map((e: ConferenceEvent) => {
              return (
                <TouchableOpacity
                  key={e.id}
                  onPress={() => navigation.navigate("Event Details", { scheduleItem: e as ConferenceEvent })}
                >
                  <TripleTextCard
                    topElement={
                      <TimeAgo time={moment(e.start_time).utc(true).local().toISOString()} pretext="Starts in " />
                    }
                    bottomText={e.location.name + ", " + e.location.city}
                    middleText={e.name}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={styles.heading}>Key Events</Text>

        <View style={styles.keyEventsView}>
          {data.events
            .filter((e: ConferenceEvent) => {
              return e.key_event;
            })
            .sort((a: ConferenceEvent, b: ConferenceEvent) => a.start_time.localeCompare(b.start_time))
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
    paddingTop: 10,
    paddingBottom: 0,
    color: colors.white,
  },
  keyEventsView: {
    marginTop: 12,
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
    elevation: 5,
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
