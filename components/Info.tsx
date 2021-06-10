import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import { Text, View, ScrollView, RefreshControl } from "react-native";
import React from "react";
import { colors, styles } from "../styles";
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
          title: "Information",
          headerStyle: {
            backgroundColor: colors.blue,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Details"
        component={InfoDetails}
        options={{
          title: "Details",
          headerStyle: {
            backgroundColor: colors.blue,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: "bold",
          },
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
      style={{ backgroundColor: colors.white }}
      contentContainerStyle={{ padding: 8 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {infoData.map((item, i) => (
        <ListItem
          key={i}
          style={{
            borderStyle: "solid",
            borderWidth: 2,
            borderRadius: 15,
            marginBottom: 5,
            overflow: "hidden",
            borderColor: colors.lightgrey,
          }}
          containerStyle={{ backgroundColor: "white" }}
          onPress={() => navigation.navigate("Details", { infoItem: item })}
        >
          <Icon
            raised
            reverse
            name={item.icon}
            type="font-awesome"
            color={item.icon === "exclamation-triangle" ? "red" : colors.blue}
          />
          <ListItem.Content>
            <ListItem.Title style={{ fontWeight: "bold", marginBottom: 6 }}>{item.title}</ListItem.Title>
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
    <ScrollView style={{ backgroundColor: colors.white }} contentContainerStyle={{ padding: 8 }}>
      <HTML source={{ html: infoItem.content }} />
    </ScrollView>
  );
}
