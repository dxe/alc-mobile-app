import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { announcementData } from './mock-data/announcements'
import HomeStack from "./components/Home";
import ScheduleStack from "./components/Schedule";
import AnnouncementsStack from "./components/Announcements";
import InfoStack from "./components/Info";
import {styles, colors} from "./styles";

const Tab = createBottomTabNavigator();

export default function App() {
  StatusBar.setBarStyle("light-content", true);
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = 'home-outline'
                break
              case 'Schedule':
                iconName = 'calendar-outline'
                break
              case 'Announcements':
                iconName = 'notifications-outline'
                break
              default:
                iconName = 'information-circle-outline'
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: colors.blue,
          inactiveTintColor: colors.grey,
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Schedule" component={ScheduleStack} />
        <Tab.Screen name="Announcements" component={AnnouncementsStack} />
        <Tab.Screen name="Info" component={InfoStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
