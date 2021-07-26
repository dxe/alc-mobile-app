import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, RefreshControl, StyleSheet, Pressable } from "react-native";
import { colors, screenHeaderOptions, globalStyles } from "../global-styles";
import { Card } from "react-native-elements";
import { delayFunc, getStoredJSON, storeJSON, wait } from "../util";
import { TripleTextCard } from "./common/TripleTextCard";
import { ScheduleEventDetails } from "./ScheduleEventDetails";
import { ConferenceEvent, getSchedule, Schedule } from "../api/schedule";
import { showMessage } from "react-native-flash-message";
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
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentTime, setCurrentTime] = useState<moment.Moment>(moment());
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [currentEvents, setCurrentEvents] = useState<ConferenceEvent[]>([] as ConferenceEvent[]);
  const [nextEvents, setNextEvents] = useState<ConferenceEvent[]>([] as ConferenceEvent[]);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!isError) return;
    showMessage({
      message: "Error",
      description: "Unable to retrieve latest schedule information.",
      type: "danger",
    });
    setIsError((v: boolean) => {
      return !v;
    });
  }, [isError]);

  // When the component initially loads, load the schedule data & update the cache.
  useEffect(() => {
    (async () => {
      setSchedule((await getStoredJSON("schedule")) || null);
      const { data, error } = await getSchedule();
      if (error) {
        setIsError(true);
        return;
      }
      setSchedule(data);
      await storeJSON("schedule", data);
    })();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);

    (async () => {
      const { data, error } = await delayFunc(getSchedule());
      if (error) {
        setIsError(true);
        setRefreshing(false);
        return;
      }
      setSchedule(data);
      await storeJSON("schedule", data);
      setRefreshing(false);
    })();
  };

  // Update displayed current & next events.
  useEffect(() => {
    const updateFeaturedEvents = () => {
      if (!schedule) return;

      // Find the events that are happening next.
      const nextStartTime = schedule.events
        .filter((x) => {
          return moment(x.start_time).utc(true).isAfter(moment());
        })
        .sort((a, b) => {
          return moment(a.start_time).utc(true).isAfter(moment(b.start_time).utc(true)) ? 1 : -1;
        })[0].start_time;

      setNextEvents(
        schedule.events.filter((x) => {
          return x.start_time === nextStartTime;
        })
      );

      // Find events happening now.
      setCurrentEvents(
        schedule.events
          .filter((x) => {
            // First find events whose start time is before now.
            return moment(x.start_time).utc(true).isBefore(moment().utc());
          })
          .filter((x) => {
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
  }, [currentTime, schedule]);

  return (
    schedule && (
      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollViewContentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
                <Pressable
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
                </Pressable>
              );
            })}
          </View>
        )}

        <Text style={styles.heading}>Key events</Text>

        <View style={styles.keyEventsView}>
          {schedule.events
            .filter((e) => {
              return e.key_event;
            })
            .map((e) => {
              return (
                <Card key={e.id} containerStyle={styles.keyEventCard}>
                  <Pressable
                    style={{ height: "100%" }}
                    onPress={() => navigation.navigate("Event Details", { scheduleItem: e as ConferenceEvent })}
                  >
                    <View style={styles.keyEventView}>
                      <View style={styles.keyEventInnerView}>
                        <Text style={styles.keyEventText}>{e.name}</Text>
                      </View>
                    </View>
                  </Pressable>
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
    backgroundColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  keyEventView: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.45)",
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
