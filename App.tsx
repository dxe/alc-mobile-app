import React, { useEffect, useRef, useState } from "react";
import { StatusBar, Text, View } from "react-native";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeStack from "./components/Home";
import ScheduleStack from "./components/Schedule";
import AnnouncementsStack from "./components/Announcements";
import InfoStack from "./components/Info";
import { colors } from "./global-styles";
import FlashMessage from "react-native-flash-message";
import { getStoredJSON, registerForPushNotificationsAsync, storeJSON } from "./util";
import WelcomeStack from "./components/Welcome";
import { CONFERENCE_ID } from "./api/api";
import { UserContext } from "./UserContext";
import { postRegisterPushNotifications } from "./api/user";
import { useSchedule } from "./api/schedule";
import { ScheduleContext } from "./ScheduleContext";
import * as Notifications from "expo-notifications";
import { FAB } from "react-native-elements";

// TODO: useful for debugging, should be set to false in prod build of app
const ALWAYS_SHOW_WELCOME_SCREEN = false;

// How to handle notifications when app is in foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();

export default function App() {
  const [registeredConferenceID, setRegisteredConferenceID] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const { data, setData, status, setStatus } = useSchedule(null);
  const [notification, setNotification] = useState(null);
  const navigationRef = useRef<NavigationContainerRef>(null);
  const [initialRoute, setInitialRoute] = useState("Home");

  StatusBar.setBarStyle("light-content", true);

  useEffect(() => {
    (async () => {
      const user = await getStoredJSON("user");
      const id = user?.conference;
      setRegisteredConferenceID(id ? id : 0);
      setReady(true);
    })();

    // Fires when a notification is received when app is in foreground.
    Notifications.addNotificationReceivedListener(_handleNotification);

    // Fires when a notification is tapped (whether or not app is open).
    Notifications.addNotificationResponseReceivedListener(_handleNotificationResponse);
  }, []);

  const _handleNotification = (notification: any) => {
    setNotification(notification);
  };

  const _handleNotificationResponse = (response: any) => {
    console.log(`Notification tapped: ${response}`);
    // TODO: test to ensure this works once app is built
    if (navigationRef.current) {
      navigationRef.current.navigate("Announcements");
    } else {
      setInitialRoute("Announcements");
    }
  };

  const userRegistered = (deviceID: string, userName: string) => {
    console.log(`user (${userName}) registered with ${deviceID}!`);
    storeJSON("user", {
      deviceID: deviceID,
      name: userName,
      conference: CONFERENCE_ID,
    });
    setRegisteredConferenceID(CONFERENCE_ID);
    (async () => {
      try {
        const pushToken = await registerForPushNotificationsAsync();
        await postRegisterPushNotifications({
          expo_push_token: pushToken,
        });
      } catch (e) {
        console.warn("Failed to register for push notifications!");
        // TODO: ask the user if they'd like to try again?
        // or just tell them it failed & let them go into their settings to try again?
      }
    })();
  };

  return (
    ready && (
      <NavigationContainer ref={navigationRef}>
        {registeredConferenceID != CONFERENCE_ID || ALWAYS_SHOW_WELCOME_SCREEN ? (
          <UserContext.Provider value={{ onUserRegistered: userRegistered }}>
            <WelcomeStack />
          </UserContext.Provider>
        ) : (
          <ScheduleContext.Provider value={{ data: data, status: status, setData: setData, setStatus: setStatus }}>
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
              initialRouteName={initialRoute}
            >
              <Tab.Screen name="Home" component={HomeStack} />
              <Tab.Screen name="Schedule" component={ScheduleStack} />
              <Tab.Screen name="Announcements" component={AnnouncementsStack} />
              <Tab.Screen name="Info" component={InfoStack} />
            </Tab.Navigator>
            {/*TODO: remove this button after testing*/}
            <View style={{ position: "absolute", bottom: 100, flex: 1, alignSelf: "center" }}>
              <FAB
                color={colors.lightred}
                titleStyle={{ fontSize: 16 }}
                onPress={() => setRegisteredConferenceID(0)}
                title={"Reset app"}
              />
            </View>
          </ScheduleContext.Provider>
        )}
        <FlashMessage position="top" />
      </NavigationContainer>
    )
  );
}
