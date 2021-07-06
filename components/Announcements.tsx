import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import React from "react";
import { colors, screenHeaderOptions, globalStyles } from "../global-styles";
import { announcementData } from "../mock-data/announcements";
import { ListItem, Icon } from "react-native-elements";
import { wait } from "../util";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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

  // TODO: implement fetching data from server & caching
  const onRefresh = () => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  };

  return (
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.scrollViewContentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {announcementData.map((a, i) => (
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
