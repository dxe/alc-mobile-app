import { createStackNavigator } from "@react-navigation/stack";
import { RefreshControl, View, FlatList, TouchableOpacity } from "react-native";
import { useCallback, useEffect } from "react";
import { screenHeaderOptions, globalStyles, colors } from "../global-styles";
import { Icon, Text, Card } from "@rneui/base";
import { Announcement, useAnnouncements } from "../api/announcement";
import { logAnalyticsEvent, showErrorMessage, useCurrentTime } from "../util";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import * as WebBrowser from "expo-web-browser";

const Stack = createStackNavigator();

export default function AnnouncementsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Announcements"
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
  const currentTime = useCurrentTime();

  // Refresh the screen whenever it is focused.
  useFocusEffect(
    useCallback(() => {
      setStatus("refreshing");
    }, [])
  );

  useEffect(() => {
    if (status != "error") return;
    showErrorMessage("Failed to get latest announcements from server.");
  }, [status]);

  return (
    <FlatList
      style={[{ backgroundColor: colors.lightGrey }]}
      contentContainerStyle={[
        {
          paddingVertical: 4,
          paddingHorizontal: 16,
          flexGrow: 1,
          paddingBottom: 30,
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={status === "refreshing" || status === "initialized"}
          onRefresh={() => setStatus("refreshing")}
          tintColor={colors.midGrey}
        />
      }
      data={
        data && Array.isArray(data)
          ? data.sort((a: Announcement, b: Announcement) => b.send_time.localeCompare(a.send_time))
          : []
      }
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Card
          containerStyle={{
            flex: 1,
            borderRadius: 8,
            borderWidth: 0,
            marginVertical: 16,
            marginHorizontal: 0,
            padding: 12,
            paddingLeft: 6,
            shadowOpacity: 0,
            elevation: 0,
            backgroundColor: colors.darkGreen,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Icon
              reverse
              name={item.icon}
              type="font-awesome-5"
              color={item.icon === "exclamation-triangle" ? colors.orange : colors.darkGrey}
              containerStyle={{ marginRight: 12 }}
              solid={true}
            />
            <View style={{ flex: 1 }}>
              <Text style={[globalStyles.textLargeSemiBold, { marginBottom: 4 }]}>{item.title}</Text>
              <Text style={[globalStyles.textMediumRegular, { marginBottom: 4 }]}>{item.message.trim()}</Text>

              {item.url != "" && (
                <TouchableOpacity
                  onPress={() => {
                    logAnalyticsEvent("AnnouncementLinkTapped", item.id, item.url);
                    WebBrowser.openBrowserAsync(item.url);
                  }}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 8,
                  }}
                >
                  <Icon
                    type={"font-awesome-5"}
                    name={"external-link-alt"}
                    containerStyle={{ paddingRight: 7 }}
                    size={16}
                    color={colors.orange}
                  />
                  <Text style={[globalStyles.textMediumBold, { color: colors.orange }]}>
                    {item.url_text != "" ? item.url_text : item.url}
                  </Text>
                </TouchableOpacity>
              )}

              <Text style={globalStyles.textSmallRegular}>{moment(item.send_time).utc(true).from(currentTime)}</Text>
            </View>
          </View>
        </Card>
      )}
    />
  );
}
