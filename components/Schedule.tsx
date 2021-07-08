import { createStackNavigator } from "@react-navigation/stack";
import { RefreshControl, ScrollView, SectionList, StyleSheet, Text, View, LogBox } from "react-native";
import React, { useEffect, useRef } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { wait } from "../util";
import { scheduleData } from "../mock-data/schedule";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import { Icon, ListItem } from "react-native-elements";
import dayjs from "dayjs";

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
    if (date.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD")) return;
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
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
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
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 10 }}>
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

      {/*TODO: This is a work in progress.*/}
      {filteredSchedule && (
        <SectionList
          sections={sectionizeSchedule(filteredSchedule)}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, section, index }) => (
            <ListItem
              key={item.id}
              style={[
                {
                  borderStyle: "solid",
                  paddingBottom: 5,
                  overflow: "hidden",
                  borderColor: colors.lightgrey,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderTopWidth: index === 0 ? 2 : 0,
                  borderBottomWidth: index === section.data.length - 1 ? 2 : 0,
                  borderTopLeftRadius: index === 0 ? 15 : 0,
                  borderBottomLeftRadius: index === section.data.length - 1 ? 15 : 0,
                  borderTopRightRadius: index === 0 ? 15 : 0,
                  borderBottomRightRadius: index === section.data.length - 1 ? 15 : 0,
                },
              ]}
            >
              <ListItem.Content>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View style={{ paddingRight: 10 }}>
                    <Text style={{ textAlign: "center", backgroundColor: colors.white, fontSize: 15 }}>{dayjs(item.start_time).format("h:mm A")}</Text>
                    <Text style={{ textAlign: "center", backgroundColor: colors.white, fontSize: 15 }}>|</Text>
                    <Text style={{ textAlign: "center", backgroundColor: colors.white, fontSize: 15 }}>{dayjs(item.start_time).format("h:mm A")}</Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
                    <ListItem.Title style={[globalStyles.listItemTitle, { fontSize: 20 }]}>{item.name}</ListItem.Title>
                    <ListItem.Subtitle>{item.location_name}</ListItem.Subtitle>
                    {index === 0 && index !== section.data.length - 1 && (
                      <View style={{ height: 2, width: "100%", backgroundColor: colors.lightgrey, marginTop: 35 }} />
                    )}
                  </View>
                </View>
              </ListItem.Content>
            </ListItem>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{ textAlign: "center", backgroundColor: colors.white, margin: 11, fontSize: 20, fontWeight: "bold" }}>{dayjs(title).format("h:mm A")}</Text>
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
  colorPrimary: { color: colors.primary },
  colorWhite: { color: colors.white },
});
