import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl, View, FlatList, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { Icon, Card, Text } from "react-native-elements";
import HTML from "react-native-render-html";
import { Info, useInfo } from "../api/info";
import { showErrorMessage } from "../util";

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
        name="Details"
        component={InfoDetails}
        options={{
          ...screenHeaderOptions,
        }}
      />
    </Stack.Navigator>
  );
}

function InfoScreen({ navigation }: any) {
  const { data, status, setStatus } = useInfo([]);

  useEffect(() => {
    if (status != "error") return;
    showErrorMessage("Failed to get latest info from server.");
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
      data={data.sort((a: Info, b: Info) => a.display_order - b.display_order)}
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
          <TouchableOpacity onPress={() => navigation.navigate("Details", { infoItem: item })}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Icon
                raised
                reverse
                name={item.icon}
                type="font-awesome-5"
                color={item.icon === "exclamation-triangle" ? colors.orange : colors.purple}
                containerStyle={{ marginRight: 12 }}
                solid={true}
              />
              <View style={{ flex: 1 }}>
                <Text style={[globalStyles.textLargeSemiBold, { marginBottom: 4 }]}>{item.title}</Text>
                <Text style={globalStyles.textSmallRegular}>{item.subtitle.trim()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      )}
    />
  );
}

function InfoDetails({ route, navigation }: any) {
  const { infoItem } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: infoItem.title,
    });
  }, [navigation, infoItem]);

  return (
    <ScrollView
      style={[{ backgroundColor: colors.white }]}
      contentContainerStyle={[{ paddingVertical: 18, paddingHorizontal: 16 }]}
    >
      <HTML
        source={{ html: infoItem.content }}
        baseFontStyle={{ fontFamily: "Inter-400", fontSize: 16, lineHeight: 24 }}
        tagsStyles={{
          strong: { fontFamily: "Inter-600" },
        }}
      />
    </ScrollView>
  );
}
