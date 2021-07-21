import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl } from "react-native";
import React, { useEffect } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { ListItem, Icon } from "react-native-elements";
import HTML from "react-native-render-html";
import { getInfo, Info } from "../api/info";
import { getStoredJSON, storeJSON } from "../util";

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
  const [refreshing, setRefreshing] = React.useState(false);
  const [info, setInfo] = React.useState<Info[]>([]);

  useEffect(() => {
    (async () => {
      setInfo((await getStoredJSON("info")) || []);
      const { data, error } = await getInfo();
      if (error) {
        // TODO: display error message
        return;
      }
      setInfo(data);
      await storeJSON("info", data);
    })();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);

    // TODO: set a minimum refresh time to improve UX if the data loads too quickly?

    (async () => {
      const { data, error } = await getInfo();
      if (error) {
        // TODO: display error message
        return;
      }
      setInfo(data);
      setRefreshing(false);
      await storeJSON("info", data);
    })();
  };

  return (
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.scrollViewContentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {info.map((item, i) => (
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
