import React, { useEffect, useState } from "react";
import { StatusBar, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeStack from "./components/Home";
import ScheduleStack from "./components/Schedule";
import AnnouncementsStack from "./components/Announcements";
import InfoStack from "./components/Info";
import { colors } from "./global-styles";
import FlashMessage from "react-native-flash-message";
import { getStoredJSON } from "./util";
import WelcomeScreen from "./components/Welcome";
import { CONFERENCE_ID } from "./api/api";

const Tab = createBottomTabNavigator();

export default function App() {
  const [registeredConferenceID, setRegisteredConferenceID] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);

  StatusBar.setBarStyle("light-content", true);

  useEffect(() => {
    (async () => {
      const id = await getStoredJSON("registered_conference_id");
      setRegisteredConferenceID(id ? id : 0);
      setReady(true);
    })();
  }, []);

  return (
    ready && (
      <NavigationContainer>
        {registeredConferenceID != CONFERENCE_ID && (
          <WelcomeScreen onSuccess={() => setRegisteredConferenceID(CONFERENCE_ID)} />
        )}
        {registeredConferenceID === CONFERENCE_ID && (
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
        )}
        <FlashMessage position="top" />
      </NavigationContainer>
    )
  );
}
