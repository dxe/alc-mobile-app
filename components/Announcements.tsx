import { createStackNavigator } from "@react-navigation/stack";
import { RefreshControl, View, FlatList, TouchableOpacity } from "react-native";
import { useCallback, useEffect, useRef } from "react";
import { screenHeaderOptions, globalStyles, colors } from "../global-styles";
import { Text, Card } from "@rneui/base";
import { FontAwesome5 } from "@expo/vector-icons";
import { Announcement, useAnnouncements } from "../api/announcement";
import { logAnalyticsEvent, showErrorMessage, useCurrentTime } from "../util";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
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

function AnnouncementsScreen() {
  const { data, status, setStatus } = useAnnouncements([]);
  const isFocused = useIsFocused();
  const listRef = useRef<any>(null);
  const currentTime = useCurrentTime();

  // Refresh the screen whenever it is focused.
  // Scroll to top first so the list is at a known position before the spinner appears,
  // avoiding the stuck-offset issue where iOS doesn't reset content offset when
  // endRefreshing() fires on a hidden view.
  useFocusEffect(
    useCallback(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      setStatus("refreshing");
    }, [])
  );

  useEffect(() => {
    if (status != "error") return;
    showErrorMessage("Failed to get latest announcements from server.");
  }, [status]);

  return (
    <FlatList
      ref={listRef}
      style={[{ backgroundColor: colors.lightBlue }]}
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
          refreshing={isFocused && status === "refreshing"}
          onRefresh={() => setStatus("refreshing")}
          tintColor={colors.midGrey}
        />
      }
      data={
        data && Array.isArray(data)
          ? data.sort((a: Announcement, b: Announcement) =>
              b.send_time.localeCompare(a.send_time)
            )
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
            <View style={{ marginRight: 12, backgroundColor: item.icon === "exclamation-triangle" ? colors.orange : colors.darkGrey, borderRadius: 100, width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
              <FontAwesome5 name={item.icon} size={16} color="white" solid />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[globalStyles.textLargeSemiBold, { marginBottom: 4 }]}
              >
                {item.title}
              </Text>
              <Text
                style={[globalStyles.textMediumRegular, { marginBottom: 4 }]}
              >
                {item.message.trim()}
              </Text>

              {item.url != "" && (
                <TouchableOpacity
                  onPress={() => {
                    logAnalyticsEvent(
                      "AnnouncementLinkTapped",
                      item.id,
                      item.url
                    );
                    WebBrowser.openBrowserAsync(item.url);
                  }}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 8,
                  }}
                >
                  <View style={{ paddingRight: 7 }}>
                    <FontAwesome5 name={"external-link-alt"} size={16} color={colors.orange} solid />
                  </View>
                  <Text
                    style={[
                      globalStyles.textMediumBold,
                      { color: colors.orange },
                    ]}
                  >
                    {item.url_text != "" ? item.url_text : item.url}
                  </Text>
                </TouchableOpacity>
              )}

              <Text style={globalStyles.textSmallRegular}>
                {moment(item.send_time).utc(true).from(currentTime)}
              </Text>
            </View>
          </View>
        </Card>
      )}
    />
  );
}
