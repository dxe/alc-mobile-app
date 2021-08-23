import { createStackNavigator } from "@react-navigation/stack";
import { RefreshControl, View, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { screenHeaderOptions, colors, globalStyles } from "../global-styles";
import { Icon, Text, Card } from "react-native-elements";
import { Announcement, useAnnouncements } from "../api/announcement";
import { showErrorMessage } from "../util";
import { TimeAgo } from "./common/TimeAgo";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import * as WebBrowser from "expo-web-browser";

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
      style={[{ backgroundColor: colors.white }]}
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
              borderColor: colors.midGrey,
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
              color={item.icon === "exclamation-triangle" ? colors.orange : colors.black}
              containerStyle={{ marginRight: 12 }}
              solid={true}
            />
            <View style={{ flex: 1 }}>
              <Text style={[globalStyles.textLargeSemiBold, { marginBottom: 4 }]}>{item.title}</Text>
              <Text style={[globalStyles.textMediumRegular, { marginBottom: 4 }]}>{item.message.trim()}</Text>

              {item.url && (
                <TouchableOpacity
                  onPress={() => WebBrowser.openBrowserAsync(item.url)}
                  style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingVertical: 8 }}
                >
                  <Icon
                    type={"font-awesome-5"}
                    name={"external-link-alt"}
                    containerStyle={{ paddingRight: 7 }}
                    size={16}
                    color={colors.purple}
                  />
                  <Text style={[globalStyles.textMediumBold, { color: colors.purple }]}>
                    {item.url_text != "" ? item.url_text : item.url}
                  </Text>
                </TouchableOpacity>
              )}

              <Text style={globalStyles.textSmallRegular}>
                <TimeAgo time={moment(item.send_time).utc(true).local().toISOString()} />
              </Text>
            </View>
          </View>
        </Card>
      )}
    />
  );
}
