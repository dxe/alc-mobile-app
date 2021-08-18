import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl, View, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { ListItem, Icon, Card, Text } from "react-native-elements";
import HTML from "react-native-render-html";
import { Info, useInfo } from "../api/info";
import { showErrorMessage } from "../util";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TimeAgo } from "./common/TimeAgo";

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
        <TouchableOpacity onPress={() => navigation.navigate("Details", { infoItem: item })}>
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
                solid={true}
              />
              <View style={{ flex: 1 }}>
                <Text style={globalStyles.listItemTitle}>{item.title}</Text>
                <Text>{item.subtitle}</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
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
    <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.scrollViewContentContainer}>
      <HTML source={{ html: infoItem.content }} />
    </ScrollView>
  );
}
