import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { colors, screenHeaderOptions, globalStyles } from "../global-styles";
import { ListItem, Icon, Text } from "react-native-elements";
import { Announcement, useAnnouncements } from "../api/announcement";
import { showErrorMessage } from "../util";
import { TimeAgo } from "./common/TimeAgo";
import { useFocusEffect } from "@react-navigation/native";

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

function AnnouncementsScreen({ navigation }: any) {
  const { data, status, setStatus } = useAnnouncements([]);

  // Refresh the screen whenever it is focused.
  useFocusEffect(
    React.useCallback(() => {
      setStatus("refreshing");
    }, [])
  );

  useEffect(() => {
    if (status != "error") return;
    showErrorMessage("Failed to get latest announcements from server.");
  }, [status]);

  return (
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.scrollViewContentContainer}
      refreshControl={<RefreshControl refreshing={status === "refreshing"} onRefresh={() => setStatus("refreshing")} />}
    >
      {data &&
        data.map((a: Announcement, i: number) => (
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
