import { createStackNavigator } from "@react-navigation/stack";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { colors, styles } from "../styles";
import { wait } from "../util";
import { scheduleData } from "../mock-data/schedule";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";

const Stack = createStackNavigator();

export default function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={ScheduleScreen}
        options={{
          title: "Schedule",
          headerStyle: {
            backgroundColor: colors.blue,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
}

function ScheduleScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [today, setToday] = React.useState(moment())
  const [selectedDate, setSelectedDate] = React.useState(moment())
  const [schedule, setSchedule] = React.useState<any>([]);
  const [filteredSchedule, setFilteredSchedule] = React.useState<any>([]);
  const calendarStrip = useRef<any>();

  // TODO: implement fetching data from server & caching
  const onRefresh = () => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  };

  const onDateSelected = (date: moment.Moment) => {
    setFilteredSchedule(schedule.filter((item: any) => {
      const localDate = moment(moment(item.start_time).utc(item.start_time).toDate()).local().format("YYYY-MM-DD")
      return localDate === date.format("YYYY-MM-DD");
    }))
    setSelectedDate(date)
  };

  const initialSelectedDate = () => {
    const now = moment();
    const conferenceStartDate = moment("2021-09-24");
    return now.isBefore(conferenceStartDate) ? conferenceStartDate : now;
  };

  useEffect(() => {
    // TODO: load from API instead of using mock data
    setSchedule(scheduleData);
    // TODO: automatically filter events on load based on currently selected day
    setFilteredSchedule(schedule.filter((item: any) => {
      const localDate = moment(moment(item.start_time).utc(item.start_time).toDate()).local().format("YYYY-MM-DD")
      return localDate === selectedDate.format("YYYY-MM-DD");
    }))
  }, [schedule]);

  // TODO: Advance the selected date if midnight has past (or maybe whenever app enters the foreground).

  return (
    <ScrollView
      style={{ backgroundColor: colors.white }}
      contentContainerStyle={{ padding: 8 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ flex: 1 }}>
        <CalendarStrip
          style={{ height: 75, paddingTop: 0, paddingBottom: 10, borderBottomWidth: 1, borderColor: colors.lightgrey }}
          calendarHeaderStyle={{ color: colors.blue }}
          dateNumberStyle={{ color: colors.blue }}
          dateNameStyle={{ color: colors.blue }}
          highlightDateNameStyle={{ color: colors.white, backgroundColor: colors.blue, width: 50, paddingTop: 5 }}
          highlightDateNumberStyle={{ color: colors.white, backgroundColor: colors.blue, width: 50, paddingBottom: 5 }}
          scrollable={false}
          startingDate={moment("2021-09-24").toDate()}
          // useIsoWeekday starts the strip on the startingDate instead of on Sunday/Monday.
          useIsoWeekday={false}
          minDate={moment("2021-09-24").toDate()}
          maxDate={moment("2021-09-30").toDate()}
          selectedDate={initialSelectedDate()}
          onDateSelected={onDateSelected}
          ref={calendarStrip}
        />
      </View>
      {/*// TODO: filter schedule based on selected date (use state for selected date)*/}
      {filteredSchedule
        .map((item: any) => {
          return <Text key={item.id}>{item.name} | {item.start_time}</Text>;
        })}
    </ScrollView>
  );
}
