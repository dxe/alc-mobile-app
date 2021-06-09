import {createStackNavigator} from "@react-navigation/stack";
import {Text, View} from "react-native";
import React from "react";
import {colors, styles} from "../styles";

const Stack = createStackNavigator();

export default function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={ScheduleScreen}
        options={{
          title: 'Schedule',
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

function ScheduleScreen() {
  return (
    <View style={styles.container}>
      <Text>Calendar Line</Text>
      <Text>List of Events</Text>
    </View>
  );
}
