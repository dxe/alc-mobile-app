import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { colors, screenHeaderOptions, globalStyles } from "../global-styles";
import { ListItem, Icon } from "react-native-elements";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getAnnouncements, Announcement } from "../api/announcement";
import { getStoredJSON, storeJSON } from "../util";
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
  const [refreshing, setRefreshing] = React.useState(false);
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);

  useEffect(() => {
    (async () => {
      setAnnouncements((await getStoredJSON("announcements")) || []);
      const { data, error } = await getAnnouncements();
      if (error) {
        // TODO: display error message
        return;
      }
      setAnnouncements(data);
      await storeJSON("announcements", data);
    })();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);

    // TODO: set a minimum refresh time to improve UX if the data loads too quickly?

    (async () => {
      const { data, error } = await getAnnouncements();
      if (error) {
        // TODO: display error message
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
            <ListItem.Subtitle style={styles.timestamp}>{dayjs(a.timestamp).fromNow()}</ListItem.Subtitle>
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
