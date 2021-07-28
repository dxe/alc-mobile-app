import { createStackNavigator } from "@react-navigation/stack";
import { RefreshControl, SectionList, StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { waitFunc, utcToLocal, showErrorMessage, ONE_HOUR_MS } from "../util";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import { ListItem } from "react-native-elements";
import { Schedule, ConferenceEvent, getSchedule } from "../api/schedule";
import { ScheduleEventDetails } from "./ScheduleEventDetails";
import { ScheduleEvent } from "./ScheduleEvent";

const Stack = createStackNavigator();

export default function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          ...screenHeaderOptions,
          title: "Schedule",
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

// sectionizeSchedule takes an array of schedule events and returns
// an object formatted for a SectionList component that is sectioned
// by time.
const sectionizeSchedule = (data: any[]) => {
  return data.reduce((re, o) => {
    let existObj = re.find((obj: any) => obj.title === o.start_time);

    if (existObj) {
      existObj.data.push(o);
    } else {
      re.push({
        title: o.start_time,
        data: [o],
      });
    }
    return re;
  }, []);
};

function ScheduleScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [filteredSchedule, setFilteredSchedule] = useState<ConferenceEvent[]>([]);
  const calendarStrip = useRef<any>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (error === "") return;
    showErrorMessage(error);
    setError("");
  }, [error]);

  useEffect(() => {
    getSchedule(setSchedule, setError);
    // Fetch new data hourly if app is left running.
    const interval = setInterval(() => {
      getSchedule(setSchedule, setError);
    }, ONE_HOUR_MS);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    (async () => {
      await waitFunc(getSchedule(setSchedule, setError));
      setRefreshing(false);
    })();
  };

  // Filter the schedule by date.
  const onDateSelected = (date: moment.Moment) => {
    if (!schedule) return;
    setFilteredSchedule(
      schedule.events.filter((item: ConferenceEvent) => {
        const localDate = moment(moment(item.start_time).utc(true).toDate()).local().format("YYYY-MM-DD");
        return localDate === date.format("YYYY-MM-DD");
      })
    );
  };

  // Whenever the schedule data is updated, filter it using the selected date.
  useEffect(() => {
    if (!schedule) return;
    onDateSelected(calendarStrip.current.getSelectedDate());
  }, [schedule]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.calendarStripWrapper}>
        {schedule && (
          <CalendarStrip
            style={styles.calendarStrip}
            calendarHeaderStyle={styles.colorPrimary}
            dateNumberStyle={styles.colorPrimary}
            dateNameStyle={styles.colorPrimary}
            highlightDateNameStyle={styles.colorWhite}
            highlightDateNumberStyle={styles.colorWhite}
            daySelectionAnimation={{ type: "background", highlightColor: colors.primary, duration: 100 }}
            scrollable={false}
            startingDate={utcToLocal(schedule.conference.start_date)}
            // useIsoWeekday starts the strip on the startingDate instead of on Sunday/Monday.
            useIsoWeekday={false}
            minDate={utcToLocal(schedule.conference.start_date)}
            maxDate={utcToLocal(schedule.conference.end_date)}
            // TODO: ensure this handles time zones properly
            selectedDate={
              moment().isBefore(schedule.conference.start_date) ? moment(schedule.conference.start_date) : moment()
            }
            onDateSelected={onDateSelected}
            ref={calendarStrip}
          />
        )}
      </View>

      {filteredSchedule && (
        <SectionList
          sections={sectionizeSchedule(filteredSchedule)}
          keyExtractor={(item: ConferenceEvent, index: number) => (item.id + index).toString()}
          renderItem={({ item, section, index }) => {
            const itemsInSection = section.data.length - 1;

            return (
              <Pressable
                onPress={() => navigation.navigate("Event Details", { scheduleItem: item as ConferenceEvent })}
              >
                <ListItem
                  containerStyle={{ backgroundColor: "transparent", paddingVertical: 5 }}
                  key={item.id}
                  // TODO: move this styling into a stylesheet if it will work w/ the variables?
                  style={[
                    {
                      borderStyle: "solid",
                      paddingBottom: 0,
                      marginBottom: index === itemsInSection ? 5 : 0,
                      overflow: "hidden",
                      borderColor: colors.lightgrey,
                      borderLeftWidth: 2,
                      borderRightWidth: 2,
                      borderTopWidth: index === 0 ? 2 : 0,
                      borderBottomWidth: index === itemsInSection ? 2 : 0,
                      borderTopLeftRadius: index === 0 ? 15 : 0,
                      borderBottomLeftRadius: index === itemsInSection ? 15 : 0,
                      borderTopRightRadius: index === 0 ? 15 : 0,
                      borderBottomRightRadius: index === itemsInSection ? 15 : 0,
                    },
                  ]}
                >
                  <ListItem.Content>
                    <ScheduleEvent event={item} nav={navigation} />
                    {index === 0 && index !== section.data.length - 1 && <View style={styles.divider} />}
                  </ListItem.Content>
                </ListItem>
              </Pressable>
            );
          }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{utcToLocal(title).format("h:mm A")}</Text>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          style={[globalStyles.scrollView, { paddingHorizontal: 8 }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  calendarStrip: {
    height: 90,
    paddingTop: 0,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: colors.lightgrey,
  },
  calendarStripWrapper: { paddingTop: 10 },
  sectionHeader: {
    textAlign: "center",
    backgroundColor: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 0,
    paddingVertical: 5,
  },
  divider: { height: 2, width: "100%", backgroundColor: colors.lightgrey, marginTop: 10 },
  colorPrimary: { color: colors.primary },
  colorWhite: { color: colors.white },
});
