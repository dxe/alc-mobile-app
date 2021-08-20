import { createStackNavigator } from "@react-navigation/stack";
import { RefreshControl, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { screenHeaderOptions, globalStyles, figmaColors, figmaStyles } from "../global-styles";
import { Icon, Text, Card } from "react-native-elements";
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
      setStatus("silentRefreshing");
    }, [])
  );

  useEffect(() => {
    if (status != "error") return;
    showErrorMessage("Failed to get latest announcements from server.");
  }, [status]);

  return (
    <FlatList
      style={[{ backgroundColor: figmaColors.white }]}
      contentContainerStyle={[{ paddingVertical: 4, paddingHorizontal: 16, flexGrow: 1, paddingBottom: 30 }]}
      refreshControl={
        <RefreshControl
          refreshing={status === "refreshing" || status === "initialized"}
          onRefresh={() => setStatus("refreshing")}
        />
      }
      data={data.sort((a: Announcement, b: Announcement) => b.send_time.localeCompare(a.send_time))}
      keyExtractor={(item) => item.id + item.title}
      renderItem={({ item }) => (
        <Card
          containerStyle={[
            {
              flex: 1,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: figmaColors.midGrey,
              marginVertical: 16,
              marginHorizontal: 0,
              padding: 12,
              paddingLeft: 6,
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
              color={item.icon === "exclamation-triangle" ? figmaColors.orange : figmaColors.black}
              containerStyle={{ marginRight: 12 }}
              solid={true}
            />
            <View style={{ flex: 1 }}>
              <Text style={[figmaStyles.textLargeSemiBold, { marginBottom: 4 }]}>{item.title}</Text>
              <Text style={[figmaStyles.textMediumRegular, { marginBottom: 4 }]}>{item.message}</Text>
              <Text style={figmaStyles.textSmallRegular}>
                <TimeAgo time={item.send_time} />
              </Text>
            </View>
          </View>
        </Card>
      )}
    />
  );
}
