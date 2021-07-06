import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, RefreshControl } from "react-native";
import React from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { infoData } from "../mock-data/info";
import { ListItem, Icon } from "react-native-elements";
import { wait } from "../util";
import HTML from "react-native-render-html";

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

  // TODO: implement fetching data from server & caching
  const onRefresh = () => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  };

  return (
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.scrollViewContentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {infoData.map((item, i) => (
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
