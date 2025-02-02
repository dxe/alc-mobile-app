import { createStackNavigator } from "@react-navigation/stack";
import {
  ScrollView,
  RefreshControl,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { globalStyles, colors, screenHeaderOptions } from "../global-styles";
import { Icon, Card, Text } from "@rneui/base";
import HTML from "react-native-render-html";
import { Info } from "../api/info";
import { logAnalyticsEvent, showErrorMessage } from "../util";
import { InfoContext } from "../InfoContext";

const Stack = createStackNavigator();

export default function InfoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{
          ...screenHeaderOptions,
          title: "More",
        }}
      />
      <Stack.Screen
        name="Info Details"
        component={InfoDetails}
        options={{
          ...screenHeaderOptions,
          title: "Details",
        }}
      />
    </Stack.Navigator>
  );
}

function InfoScreen({ navigation }: any) {
  const { data, status, setStatus } = useContext(InfoContext);

  useEffect(() => {
    if (status != "error") return;
    showErrorMessage("Failed to get latest info from server.");
  }, [status]);

  return (
    <FlatList
      style={[{ backgroundColor: colors.mediumGrey }]}
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
      data={data.sort((a: Info, b: Info) => a.display_order - b.display_order)}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Card
          containerStyle={[
            {
              flex: 1,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.lightGreen,
              marginVertical: 16,
              marginHorizontal: 0,
              padding: 12,
              paddingLeft: 6,
              backgroundColor: colors.darkGrey,
            },
            globalStyles.shadow,
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              logAnalyticsEvent("InfoItemTapped", item.id, item.title);
              navigation.navigate("Info Details", { infoItem: item });
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Icon
                raised
                reverse
                name={item.icon}
                type="font-awesome-5"
                color={
                  item.icon === "exclamation-triangle"
                    ? colors.orange
                    : colors.lightGreen
                }
                containerStyle={{
                  marginRight: 12,
                  backgroundColor: colors.lightGreen,
                }}
                solid={true}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[globalStyles.textLargeSemiBold, { marginBottom: 4 }]}
                >
                  {item.title}
                </Text>
                <Text style={globalStyles.textSmallRegular}>
                  {item.subtitle.trim()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      )}
    />
  );
}

export function InfoDetails({ route, navigation }: any) {
  const { infoItem } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: infoItem.title,
    });
  }, [navigation, infoItem]);

  return (
    <ScrollView
      style={[{ backgroundColor: colors.mediumGrey }]}
      contentContainerStyle={[{ paddingVertical: 18, paddingHorizontal: 16 }]}
    >
      <HTML
        source={{ html: infoItem.content }}
        baseFontStyle={{
          fontFamily: "Inter-400",
          fontSize: 16,
          lineHeight: 24,
          color: colors.white,
        }}
        tagsStyles={{
          strong: { fontFamily: "Inter-600" },
          a: { color: colors.darkGreen },
        }}
      />
    </ScrollView>
  );
}
