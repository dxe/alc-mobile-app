import {createStackNavigator} from "@react-navigation/stack";
import {Text, View} from "react-native";
import React from "react";
import {colors, styles} from "../styles";
import {announcementData} from "../mock-data/announcements";

const Stack = createStackNavigator();

export default function AnnouncementsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={AnnouncementsScreen}
        options={{
          title: 'Announcements',
          headerStyle: {
            backgroundColor: colors.blue,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function AnnouncementsScreen() {
  return (
    <View style={styles.container}>
      <Text>List of Announcements</Text>
      {announcementData.map(a => {
        return <Text>{a.title}</Text>
      })}
    </View>
  );
}
