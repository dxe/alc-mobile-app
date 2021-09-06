import { createStackNavigator, HeaderStyleInterpolators } from "@react-navigation/stack";
import { RefreshControl, SectionList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { utcToLocal, showErrorMessage, utcToLocalDateString, logAnalyticsEvent } from "../util";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import { ListItem } from "react-native-elements";
import { Schedule, ConferenceEvent } from "../api/schedule";
import { ScheduleEventDetails } from "./ScheduleEventDetails";
import { ScheduleEvent } from "./ScheduleEvent";
import { ScheduleContext } from "../ScheduleContext";

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
  const [filteredSchedule, setFilteredSchedule] = useState<ConferenceEvent[]>([]);
  const calendarStrip = useRef<any>();
  const eventsList = useRef<any>();
  const { data, status, setStatus } = useContext(ScheduleContext);

  useEffect(() => {
    if (status != "error") return;
    showErrorMessage("Failed to get latest schedule from server.");
  }, [status]);

  // Filter the schedule by date.
  const onDateSelected = (date: moment.Moment) => {
    if (!data) return;
    logAnalyticsEvent("CalendarStripDateTapped", 0, date.format("YYYY-MM-DD"));
    setFilteredSchedule(
      data.events
        .filter((item: ConferenceEvent) => {
          return utcToLocalDateString(item.start_time) === date.format("YYYY-MM-DD");
        })
        .sort((a: ConferenceEvent, b: ConferenceEvent) => a.start_time.localeCompare(b.start_time))
    );
    eventsList.current?.getScrollResponder().scrollTo({ x: 0, y: 0, animated: true });
  };

  // Whenever the schedule data is updated, filter it using the selected date.
  useEffect(() => {
    if (!data) return;
    setFilteredSchedule(
      data.events
        .filter((item: ConferenceEvent) => {
          return utcToLocalDateString(item.start_time) === calendarStrip.current.getSelectedDate().format("YYYY-MM-DD");
        })
        .sort((a: ConferenceEvent, b: ConferenceEvent) => a.start_time.localeCompare(b.start_time))
    );
  }, [data]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.calendarStripWrapper}>
        {data && (
          <CalendarStrip
            style={styles.calendarStrip}
            calendarHeaderStyle={globalStyles.textLabel}
            dateNumberStyle={{ color: colors.purple, fontFamily: "Inter-400", fontSize: 12, lineHeight: 14 }}
            dateNameStyle={{ color: colors.purple, fontFamily: "Inter-500", fontSize: 12, lineHeight: 14 }}
            highlightDateNumberStyle={{
              color: colors.white,
              fontFamily: "Inter-400",
              fontSize: 12,
              lineHeight: 14,
            }}
            highlightDateNameStyle={{ color: colors.white, fontFamily: "Inter-500", fontSize: 12, lineHeight: 14 }}
            daySelectionAnimation={{ type: "background", highlightColor: colors.purple, duration: 100 }}
            scrollable={false}
            startingDate={utcToLocal(data.conference.start_date)}
            // useIsoWeekday starts the strip on the startingDate instead of on Sunday/Monday.
            useIsoWeekday={false}
            minDate={utcToLocal(data.conference.start_date)}
            maxDate={utcToLocal(data.conference.end_date)}
            selectedDate={moment().isBefore(data.conference.start_date) ? moment(data.conference.start_date) : moment()}
            onDateSelected={onDateSelected}
            ref={calendarStrip}
            maxDayComponentSize={50} // This is needed to prevent UI glitches
          />
        )}
      </View>

      {filteredSchedule && (
        <SectionList
          ref={eventsList}
          stickySectionHeadersEnabled={false}
          sections={sectionizeSchedule(filteredSchedule)}
          keyExtractor={(item: ConferenceEvent) => item.id.toString()}
          renderItem={({ item, section, index }) => {
            const itemsInSection = section.data.length - 1;
            return (
              <ListItem
                containerStyle={{
                  padding: item.attending ? 11 : 12, // to offset border width change
                  backgroundColor: colors.white,
                  borderRadius: 8,
                }}
                key={item.id}
                style={[
                  {
                    flex: 1,
                    borderRadius: 8,
                    borderWidth: item.attending ? 2 : 1,
                    borderColor: item.attending ? colors.purple : colors.lightGrey,
                    backgroundColor: colors.white,
                    marginBottom: index === itemsInSection ? 0 : 18,
                  },
                  globalStyles.shadow,
                ]}
              >
                <ListItem.Content>
                  <ScheduleEvent event={item} nav={navigation} />
                </ListItem.Content>
              </ListItem>
            );
          }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, globalStyles.textMediumBold]}>
              {utcToLocal(title).format("h:mm A")}
            </Text>
          )}
          refreshControl={
            <RefreshControl
              refreshing={status === "refreshing" || status === "initialized"}
              onRefresh={() => setStatus("refreshing")}
            />
          }
          style={{ backgroundColor: colors.lightGrey }}
          contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 15, flexGrow: 1 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  calendarStrip: {
    height: 83,
    paddingTop: 0,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: colors.midGrey,
    backgroundColor: colors.white,
  },
  calendarStripWrapper: { paddingTop: 10, backgroundColor: colors.white },
  sectionHeader: {
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
});
