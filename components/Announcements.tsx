import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, screenHeaderOptions, globalStyles } from "../global-styles";
import { ListItem, Icon } from "react-native-elements";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getAnnouncements, Announcement } from "../api/announcement";
import { delayFunc, getStoredJSON, storeJSON } from "../util";
import { showMessage } from "react-native-flash-message";
import { TimeAgo } from "./common/TimeAgo";
dayjs.extend(relativeTime);

const Stack = createStackNavigator();

export default function AnnouncementsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={AnnouncementsScreen}
        options={{
          ...screenHeaderOptions,
          title: "Announcements",
        }}
      />
    </Stack.Navigator>
  );
}

function AnnouncementsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!isError) return;
    showMessage({
      message: "Error",
      description: "Unable to retrieve latest announcements.",
      type: "danger",
    });
    setIsError((v: boolean) => {
      return !v;
    });
  }, [isError]);

  useEffect(() => {
    // Load announcement data when this component loads.
    (async () => {
      setAnnouncements((await getStoredJSON("announcements")) || []);
      const { data, error } = await getAnnouncements();
      if (error) {
        setIsError(true);
        return;
      }
      setAnnouncements(data);
      await storeJSON("announcements", data);
    })();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    (async () => {
      const { data, error } = await delayFunc(getAnnouncements());
      if (error) {
        setIsError(true);
        setRefreshing(false);
        return;
      }
      setAnnouncements(data);
      setRefreshing(false);
      await storeJSON("announcements", data);
    })();
  };

  return (
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.scrollViewContentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {announcements.map((a, i) => (
        <ListItem key={i} style={globalStyles.listItem}>
          <Icon
            raised
            reverse
            name={a.icon}
            type="font-awesome"
            color={a.icon === "exclamation-triangle" ? "red" : colors.primary}
          />
          <ListItem.Content>
            <ListItem.Title style={globalStyles.listItemTitle}>{a.title}</ListItem.Title>
            <ListItem.Subtitle>{a.message}</ListItem.Subtitle>
            <ListItem.Subtitle style={styles.timestamp}>
              <TimeAgo time={a.send_time} />
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  timestamp: {
    fontSize: 12,
    paddingTop: 5,
  },
});
