import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeStack from "./components/Home";
import ScheduleStack from "./components/Schedule";
import AnnouncementsStack from "./components/Announcements";
import InfoStack from "./components/Info";
import { colors } from "./global-styles";
import FlashMessage from "react-native-flash-message";

const Tab = createBottomTabNavigator();

export default function App() {
  StatusBar.setBarStyle("light-content", true);
  return (
    <NavigationContainer>
      {/*TODO: create welcome flow for the first time the app is opened*/}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case "Home":
                iconName = "home-outline";
                break;
              case "Schedule":
                iconName = "calendar-outline";
                break;
              case "Announcements":
                iconName = "notifications-outline";
                break;
              default:
                iconName = "information-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: colors.primary,
          inactiveTintColor: colors.grey,
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Schedule" component={ScheduleStack} />
        <Tab.Screen name="Announcements" component={AnnouncementsStack} />
        <Tab.Screen name="Info" component={InfoStack} />
      </Tab.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}
