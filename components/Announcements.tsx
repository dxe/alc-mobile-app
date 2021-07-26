import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, screenHeaderOptions, globalStyles } from "../global-styles";
import { ListItem, Icon } from "react-native-elements";
import { getAnnouncements, Announcement } from "../api/announcement";
import { waitFunc, showErrorMessage, ONE_HOUR_MS } from "../util";
import { TimeAgo } from "./common/TimeAgo";
import { getInfo } from "../api/info";

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
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (error === "") return;
    showErrorMessage(error);
    setError("");
  }, [error]);

  useEffect(() => {
    getAnnouncements(setAnnouncements, setError);
    // Fetch new data hourly if app is left running.
    const interval = setInterval(() => {
      getAnnouncements(setAnnouncements, setError);
    }, ONE_HOUR_MS);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    (async () => {
      await waitFunc(getAnnouncements(setAnnouncements, setError));
      setRefreshing(false);
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
