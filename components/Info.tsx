import {createStackNavigator} from "@react-navigation/stack";
import {Text, View} from "react-native";
import React from "react";
import {colors, styles} from "../styles";

const Stack = createStackNavigator();

export default function InfoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{
          title: 'Information',
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

function InfoScreen() {
  return (
    <View style={styles.container}>
      <Text>FAQ</Text>
      <Text>Community Agreements</Text>
      <Text>Contact Us</Text>
      <Text>Chants & Lyrics</Text>
    </View>
  );
}
