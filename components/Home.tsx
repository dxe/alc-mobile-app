import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import { Text, View, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { screenHeaderOptions, globalStyles, colors } from "../global-styles";
import { showErrorMessage } from "../util";
import { TripleTextCard } from "./common/TripleTextCard";
import { ScheduleEventDetails } from "./ScheduleEventDetails";
import { ConferenceEvent } from "../api/schedule";
import { TimeAgo } from "./common/TimeAgo";
import moment from "moment";
import { ScheduleContext } from "../ScheduleContext";

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
  const [keyEvents, setKeyEvents] = useState<ConferenceEvent[]>([] as ConferenceEvent[]);
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

      // Find key events happening today
      setKeyEvents(
        data.events
          .filter((x: ConferenceEvent) => {
            // First key events whose start date is today.
            return (
              x.key_event &&
              moment(moment(x.start_time).utc(true).toDate()).local().format("YYYY-MM-DD") ===
                moment().format("YYYY-MM-DD")
            );
          })
          .sort((a: ConferenceEvent, b: ConferenceEvent) => a.start_time.localeCompare(b.start_time))
      );
    };
    updateFeaturedEvents();

    const interval = setInterval(() => {
      setCurrentTime(moment().utc());
      updateFeaturedEvents();
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTime, data]);

  return (
    data && (
      <ScrollView
        style={[{ backgroundColor: colors.purple }]}
        contentContainerStyle={[{ paddingVertical: 16, paddingHorizontal: 16, paddingBottom: 30 }]}
        refreshControl={
          <RefreshControl
            refreshing={status === "refreshing" || status === "initialized"}
            onRefresh={() => setStatus("refreshing")}
            tintColor={colors.white}
          />
        }
      >
        {currentEvents && currentEvents.length > 0 && (
          <View style={{ marginBottom: 28 }}>
            <Text style={[globalStyles.h1]}>Happening Now</Text>

            {currentEvents.map((e: ConferenceEvent) => {
              return (
                <TouchableOpacity
                  key={e.id}
                  onPress={() => navigation.navigate("Event Details", { scheduleItem: e as ConferenceEvent })}
                >
                  <TripleTextCard
                    topElement={
                      <TimeAgo time={moment(e.start_time).utc(true).local().toISOString()} pretext="Started " />
                    }
                    middleText={e.name}
                    bottomText={e.location.name + ", " + e.location.city}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {nextEvents && nextEvents.length > 0 && (
          <View style={{ marginBottom: 28 }}>
            <Text style={globalStyles.h1}>Coming Up Next</Text>

            {nextEvents.map((e: ConferenceEvent) => {
              return (
                <TouchableOpacity
                  key={e.id}
                  onPress={() => navigation.navigate("Event Details", { scheduleItem: e as ConferenceEvent })}
                >
                  <TripleTextCard
                    topElement={
                      <TimeAgo time={moment(e.start_time).utc(true).local().toISOString()} pretext="Starts " />
                    }
                    middleText={e.name}
                    bottomText={e.location.name + ", " + e.location.city}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {keyEvents && keyEvents.length > 0 && (
          <View style={{ marginBottom: 28 }}>
            <Text style={globalStyles.h1}>Today's Main Events</Text>

            {keyEvents.map((e: ConferenceEvent) => {
              return (
                <TouchableOpacity
                  key={e.id}
                  onPress={() => navigation.navigate("Event Details", { scheduleItem: e as ConferenceEvent })}
                >
                  <TripleTextCard
                    topElement={
                      // TODO: say "happening now" or "ended" if key events are in progress or over
                      <TimeAgo
                        time={moment(e.start_time).utc(true).local().toISOString()}
                        pretext={
                          moment(moment(e.start_time).utc(true).toDate()).local().isAfter(moment())
                            ? "Starts "
                            : "Started "
                        }
                      />
                    }
                    middleText={e.name}
                    bottomText={e.location.name + ", " + e.location.city}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    )
  );
}
