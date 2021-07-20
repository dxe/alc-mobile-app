import { createStackNavigator } from "@react-navigation/stack";
import {
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Dimensions,
  Button,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { utcToLocal, wait } from "../util";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import { ListItem } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import MapView, { Marker } from "react-native-maps";
import { showLocation } from "react-native-map-link";
import { ConferenceEvent, getSchedule } from "../api/schedule";
import { Conference, getConferences } from "../api/conference";

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
        component={EventDetails}
        options={{
          ...screenHeaderOptions,
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

function ScheduleScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [schedule, setSchedule] = React.useState<any>([]);
  const [filteredSchedule, setFilteredSchedule] = React.useState<ConferenceEvent[]>([]);
  const calendarStrip = useRef<any>();
  const [conference, setConference] = React.useState<Conference | null>(null);
  const [selectedDate, setSelectedDate] = React.useState(utcToLocal(conference?.start_date));

  const onRefresh = () => {
    setRefreshing(true);

    // TODO: set a minimum refresh time to improve UX if the data loads too quickly?

    (async () => {
      const { data, error } = await getSchedule();
      if (error) {
        // TODO: display error message
      }
      setSchedule(data);
      setRefreshing(false);
    })();
  };

  const onDateSelected = (date: moment.Moment) => {
    if (date.format("YYYY-MM-DD") === selectedDate?.format("YYYY-MM-DD")) return;
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
    if (conference == null) {
      return now;
    }
    return now.isBefore(utcToLocal(conference.start_date)) ? utcToLocal(conference.start_date) : now;
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await getConferences();
      if (error) {
        // TODO: display error message
      }
      setConference(data[0]);
    })();
  }, []);

  useEffect(() => {
    if (conference) {
      const initDate = initSelectedDate();
      setSelectedDate(initDate);
      (async () => {
        const { data, error } = await getSchedule();
        if (error) {
          // TODO: display error message
        }
        setSchedule(data);
        setFilteredSchedule(
          data.filter((item: any) => {
            const localDate = moment(moment(item.start_time).utc(item.start_time).toDate())
              .local()
              .format("YYYY-MM-DD");
            return localDate === initDate.format("YYYY-MM-DD");
          })
        );
      })();
    }
  }, [conference]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.calendarStripWrapper}>
        <CalendarStrip
          style={styles.calendarStrip}
          calendarHeaderStyle={styles.colorPrimary}
          dateNumberStyle={styles.colorPrimary}
          dateNameStyle={styles.colorPrimary}
          highlightDateNameStyle={styles.colorWhite}
          highlightDateNumberStyle={styles.colorWhite}
          daySelectionAnimation={{ type: "background", highlightColor: colors.primary, duration: 100 }}
          scrollable={false}
          startingDate={utcToLocal(conference?.start_date)}
          // useIsoWeekday starts the strip on the startingDate instead of on Sunday/Monday.
          useIsoWeekday={false}
          minDate={utcToLocal(conference?.start_date)}
          maxDate={utcToLocal(conference?.end_date)}
          selectedDate={selectedDate}
          onDateSelected={onDateSelected}
          ref={calendarStrip}
        />
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
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View style={{ paddingRight: 10 }}>
                        <Text style={styles.startTime}>{utcToLocal(item.start_time).format("h:mm A")}</Text>
                        <Text style={styles.endTime}>|</Text>
                        <Text style={styles.endTime}>
                          {utcToLocal(item.start_time).add(item.length, "minute").format("h:mm A")}
                        </Text>
                      </View>
                      <View style={{ flexGrow: 1 }}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "column",
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                            }}
                          >
                            <ListItem.Title style={[globalStyles.listItemTitle, { fontSize: 20, marginBottom: 10 }]}>
                              {item.name}
                            </ListItem.Title>
                            <ListItem.Subtitle>
                              <FeatherIcon name="map-pin" size={16} />{" "}
                              <Text style={{ fontSize: 16 }}>{item.location.name}</Text>
                            </ListItem.Subtitle>
                            <Pressable onPress={() => console.log("rsvp status pressed")}>
                              <View style={styles.rsvpStatus}>
                                <Text style={styles.rsvpStatusText}>Attending</Text>
                              </View>
                            </Pressable>
                          </View>
                          <Pressable
                            onPress={() =>
                              navigation.navigate("Event Details", { scheduleItem: item as ConferenceEvent })
                            }
                          >
                            <View
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                borderRadius: 100,
                                height: "100%",
                              }}
                            >
                              <Ionicons name="caret-forward" size={30} />
                            </View>
                          </Pressable>
                        </View>
                        {index === 0 && index !== section.data.length - 1 && <View style={styles.divider} />}
                      </View>
                    </View>
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

export function EventDetails({ route }: any) {
  const { scheduleItem }: { scheduleItem: ConferenceEvent } = route.params;

  return (
    // TODO: improve the Event Details screen.
    <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.scrollViewContentContainer}>
      <Text style={{ fontWeight: "bold", fontSize: 26, paddingTop: 16 }}>{scheduleItem.name}</Text>
      <Text style={{ paddingTop: 5 }}>{moment(scheduleItem.start_time).format("dddd, MMMM D")}</Text>
      <Text>
        {utcToLocal(scheduleItem.start_time).format("h:mm A")} -&nbsp;
        {utcToLocal(scheduleItem.start_time).add(scheduleItem.length, "minute").format("h:mm A")}
      </Text>
      <View style={{ paddingTop: 12 }}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: scheduleItem.location.lat,
            longitude: scheduleItem.location.lng,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          }}
        >
          <Marker
            key={scheduleItem.id}
            coordinate={{ latitude: scheduleItem.location.lat, longitude: scheduleItem.location.lng }}
            title={scheduleItem.location.name}
            description={scheduleItem.location.address + ", " + scheduleItem.location.city}
          />
        </MapView>
      </View>
      <Button
        onPress={() => {
          showLocation({
            latitude: scheduleItem.location.lat,
            longitude: scheduleItem.location.lng,
            title: scheduleItem.location.name,
            googleForceLatLon: true, // force Google Maps to use the coords for the query instead of the title
            googlePlaceId: scheduleItem.location.place_id,
          });
        }}
        title="Get directions"
        color={colors.primary}
      />
      <Text style={{ paddingTop: 10 }}>ATTENDEE COUNT</Text>
      <Text>RSVP BUTTON</Text>
      <Text style={{ fontWeight: "bold", fontSize: 18, paddingTop: 10 }}>Description</Text>
      <Text>{scheduleItem.description}</Text>
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
  calendarStripWrapper: { paddingTop: 10 },
  divider: { height: 2, width: "100%", backgroundColor: colors.lightgrey, marginTop: 10 },
  startTime: { textAlign: "center", backgroundColor: colors.white, fontSize: 15, paddingTop: 3 },
  endTime: { textAlign: "center", backgroundColor: colors.white, color: colors.grey, fontSize: 15 },
  rsvpStatus: {
    backgroundColor: colors.lightgreen,
    padding: 10,
    marginTop: 10,
    borderRadius: 100,
  },
  rsvpStatusText: { color: colors.white, fontWeight: "bold" },
  sectionHeader: {
    textAlign: "center",
    backgroundColor: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 0,
    paddingVertical: 5,
  },
  map: {
    width: Dimensions.get("window").width - 20,
    height: 200,
  },
  colorPrimary: { color: colors.primary },
  colorWhite: { color: colors.white },
});
