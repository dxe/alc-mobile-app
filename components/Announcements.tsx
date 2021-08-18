import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl, StyleSheet, View, FlatList, ViewComponent } from "react-native";
import React, { useEffect } from "react";
import { colors, screenHeaderOptions, globalStyles } from "../global-styles";
import { ListItem, Icon, Text, Card } from "react-native-elements";
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
    <FlatList
      style={[globalStyles.scrollView, globalStyles.scrollViewContentContainer]}
      refreshControl={
        <RefreshControl
          refreshing={status === "refreshing" || status === "initialized"}
          onRefresh={() => setStatus("refreshing")}
        />
      }
      data={data}
      keyExtractor={(item) => item.id + item.title}
      renderItem={({ item }) => (
        <Card
          containerStyle={[
            {
              flex: 1,
              borderRadius: 10,
              marginHorizontal: 0,
              marginVertical: 10,
              borderWidth: 2,
              borderColor: colors.lightgrey,
            },
            globalStyles.shadow,
          ]}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Icon
              raised
              reverse
              name={item.icon}
              type="font-awesome-5"
              color={item.icon === "exclamation-triangle" ? "red" : colors.primary}
              containerStyle={{ marginRight: 15 }}
            />
            <View>
              <Text style={globalStyles.listItemTitle}>{item.title}</Text>
              <Text>{item.message}</Text>
              <Text style={styles.timestamp}>
                <TimeAgo time={item.send_time} />
              </Text>
            </View>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  timestamp: {
    fontSize: 12,
    paddingTop: 7,
  },
});
