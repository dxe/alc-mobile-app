import { createStackNavigator } from "@react-navigation/stack";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { wait } from "../util";
import { scheduleData } from "../mock-data/schedule";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";

// TODO: Get start & end date from the backend.
export const CONFERENCE_START_DATE = moment("2021-09-24");
export const CONFERENCE_END_DATE = moment("2021-09-30");

const Stack = createStackNavigator();

export default function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={ScheduleScreen}
        options={{
          ...screenHeaderOptions,
          title: "Schedule",
        }}
      />
    </Stack.Navigator>
  );
}

function ScheduleScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(CONFERENCE_START_DATE);
  const [schedule, setSchedule] = React.useState<any>([]);
  const [filteredSchedule, setFilteredSchedule] = React.useState<any>([]);
  const calendarStrip = useRef<any>();

  // TODO: implement fetching data from server & caching
  const onRefresh = () => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  };

  const onDateSelected = (date: moment.Moment) => {
    setSelectedDate(date);
    setFilteredSchedule(
      schedule.filter((item: any) => {
        const localDate = moment(moment(item.start_time).utc(item.start_time).toDate()).local().format("YYYY-MM-DD");
        return localDate === date.format("YYYY-MM-DD");
      })
    );
  };

  const initSelectedDate = () => {
    const now = moment();
    return now.isBefore(CONFERENCE_START_DATE) ? CONFERENCE_START_DATE : now;
  };

  useEffect(() => {
    // TODO: load from API instead of using mock data
    setSchedule(scheduleData);
    const initDate = initSelectedDate();
    setSelectedDate(initDate);
    setFilteredSchedule(
      scheduleData.filter((item: any) => {
        const localDate = moment(moment(item.start_time).utc(item.start_time).toDate()).local().format("YYYY-MM-DD");
        return localDate === initDate.format("YYYY-MM-DD");
      })
    );
  }, []);

  return (
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.scrollViewContentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ flex: 1 }}>
        <CalendarStrip
          style={styles.calendarStrip}
          calendarHeaderStyle={styles.colorPrimary}
          dateNumberStyle={styles.colorPrimary}
          dateNameStyle={styles.colorPrimary}
          highlightDateNameStyle={styles.colorWhite}
          highlightDateNumberStyle={styles.colorWhite}
          daySelectionAnimation={{ type: "background", highlightColor: colors.primary, duration: 100 }}
          scrollable={false}
          startingDate={CONFERENCE_START_DATE}
          // useIsoWeekday starts the strip on the startingDate instead of on Sunday/Monday.
          useIsoWeekday={false}
          minDate={CONFERENCE_START_DATE}
          maxDate={CONFERENCE_END_DATE}
          selectedDate={selectedDate}
          onDateSelected={onDateSelected}
          ref={calendarStrip}
        />
      </View>
      {filteredSchedule.map((item: any) => {
        return (
          <Text key={item.id}>
            {item.name} | {item.start_time}
          </Text>
        );
      })}
    </ScrollView>
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
  colorPrimary: { color: colors.primary },
  colorWhite: { color: colors.white },
});
