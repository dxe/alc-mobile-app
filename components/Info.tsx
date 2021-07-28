import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { ListItem, Icon } from "react-native-elements";
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
          title: "Information",
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
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.scrollViewContentContainer}
      refreshControl={<RefreshControl refreshing={status === "refreshing"} onRefresh={() => setStatus("refreshing")} />}
    >
      {data &&
        data.map((item: Info, i: number) => (
          <ListItem
            key={i}
            style={globalStyles.listItem}
            onPress={() => navigation.navigate("Details", { infoItem: item })}
          >
            <Icon
              raised
              reverse
              name={item.icon}
              type="font-awesome"
              color={item.icon === "exclamation-triangle" ? "red" : colors.primary}
            />
            <ListItem.Content>
              <ListItem.Title style={globalStyles.listItemTitle}>{item.title}</ListItem.Title>
              <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
    </ScrollView>
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
