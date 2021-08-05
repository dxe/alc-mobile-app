import React, { useEffect, useState } from "react";
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
import { getStoredJSON, storeJSON } from "./util";
import WelcomeStack from "./components/Welcome";
import { CONFERENCE_ID } from "./api/api";
import { UserContext } from "./UserContext";
import { postRegisterPushNotifications } from "./api/user";

// TODO: useful for debugging, should be set to false in prod build of app
const ALWAYS_SHOW_WELCOME_SCREEN = false;

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

  // TODO: store user's name in local storage too so we can use it when they RSVP?
  const userRegistered = (deviceID: string) => {
    console.log(`user registered with ${deviceID}!`);
    storeJSON("device_id", deviceID);
    storeJSON("registered_conference_id", CONFERENCE_ID);
    setRegisteredConferenceID(CONFERENCE_ID);
    // TODO: request to allow push notifications
    (async () => {
      // TODO: if this fails, ask the user if they'd like to try again?
      // or just tell them it failed & let them go into their settings to try again?
      await postRegisterPushNotifications({
        expo_push_token: "TODO-not-a-real-token-123", // TODO
      });
    })();
  };

  return (
    ready && (
      <NavigationContainer>
        {registeredConferenceID != CONFERENCE_ID || ALWAYS_SHOW_WELCOME_SCREEN ? (
          <UserContext.Provider value={{ onUserRegistered: userRegistered }}>
            <WelcomeStack />
          </UserContext.Provider>
        ) : (
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
