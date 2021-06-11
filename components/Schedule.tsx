import { createStackNavigator } from "@react-navigation/stack";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { colors, styles } from "../styles";
import { wait } from "../util";
import { scheduleData } from "../mock-data/schedule";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";

const CONFERENCE_START_DATE = moment("2021-09-24");
const CONFERENCE_END_DATE = moment("2021-09-30");

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

// TODO: clean up how events are filtered so there is no duplicate code

function ScheduleScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(CONFERENCE_START_DATE);
  const [today, setToday] = React.useState(moment());
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
    // TODO: update "now" in state as well & set up an interval in the useEffect to watch it
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

  // TODO: Advance the selected date if midnight has past (or maybe whenever app enters the foreground).

  return (
    <ScrollView
      style={{ backgroundColor: colors.white }}
      contentContainerStyle={{ padding: 8 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ flex: 1 }}>
        <CalendarStrip
          style={{
            height: 90,
            paddingTop: 0,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderColor: colors.lightgrey,
          }}
          calendarHeaderStyle={{ color: colors.blue }}
          dateNumberStyle={{ color: colors.blue }}
          dateNameStyle={{ color: colors.blue }}
          highlightDateNameStyle={{ color: colors.white }}
          highlightDateNumberStyle={{
            color: colors.white,
          }}
          //@ts-ignore (valid type options seem incorrect for daySelectionAnimation)
          daySelectionAnimation={{ type: "background", highlightColor: colors.blue, duration: 100 }}
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
      {/*// TODO: filter schedule based on selected date (use state for selected date)*/}
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
