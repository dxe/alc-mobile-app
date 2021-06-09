import {createStackNavigator} from "@react-navigation/stack";
import React from "react";
import {Text, View} from "react-native";
import {colors, styles} from "../styles";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Animal Liberation Conference',
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

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Schedule</Text>
      <Text>Speakers</Text>
      <Text>Key Events</Text>
      <Text>Chants & Lyrics</Text>
      <Text>Contact Us</Text>
    </View>
  );
}
