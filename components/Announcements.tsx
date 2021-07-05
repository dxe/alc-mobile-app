import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl } from "react-native";
import React from "react";
import { colors } from "../styles";
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
          title: "Announcements",
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

function AnnouncementsScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  // TODO: implement fetching data from server & caching
  const onRefresh = () => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.white }}
      contentContainerStyle={{ padding: 8 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {announcementData.map((a, i) => (
        <ListItem
          key={i}
          style={{
            borderStyle: "solid",
            borderWidth: 2,
            borderRadius: 15,
            marginBottom: 5,
            overflow: "hidden",
            borderColor: colors.lightgrey,
          }}
        >
          <Icon
            raised
            reverse
            name={a.icon}
            type="font-awesome"
            color={a.icon === "exclamation-triangle" ? "red" : colors.blue}
          />
          <ListItem.Content>
            <ListItem.Title style={{ fontWeight: "bold", textTransform: "capitalize", marginBottom: 6 }}>
              {a.title}
            </ListItem.Title>
            <ListItem.Subtitle>{a.message}</ListItem.Subtitle>
            <ListItem.Subtitle style={{ fontSize: 12, paddingTop: 5 }}>
              {dayjs(a.timestamp).fromNow()}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  );
}
