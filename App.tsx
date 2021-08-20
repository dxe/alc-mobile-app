import React, { useEffect, useRef, useState } from "react";
import { Alert, StatusBar, View } from "react-native";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./components/Home";
import ScheduleStack from "./components/Schedule";
import AnnouncementsStack from "./components/Announcements";
import InfoStack from "./components/Info";
import { colors } from "./global-styles";
import FlashMessage from "react-native-flash-message";
import { getStoredJSON, registerForPushNotificationsAsync, storeJSON } from "./util";
import { WelcomeScreen } from "./components/Welcome";
import { CONFERENCE_ID } from "./api/api";
import { UserContext } from "./UserContext";
import { postRegisterPushNotifications } from "./api/user";
import { useSchedule } from "./api/schedule";
import { ScheduleContext } from "./ScheduleContext";
import * as Notifications from "expo-notifications";
import { Icon } from "react-native-elements";
import { useFonts } from "expo-font";
import * as Device from "expo-device";
import * as Updates from "expo-updates";
import { UpdateEvent, UpdateEventType } from "expo-updates";
import AppLoading from "expo-app-loading";

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
  let [fontsLoaded] = useFonts({
    "Inter-400": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-500": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-600": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Inter-700": require("./assets/fonts/Inter-Bold.ttf"),
  });

  StatusBar.setBarStyle("light-content", true);
  if (Device.osName === "Android") {
    StatusBar.setBackgroundColor("#00000000");
  }

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

    Updates.addListener(_handleUpdate);
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

  const _handleUpdate = (event: UpdateEvent) => {
    if (event.type === UpdateEventType.UPDATE_AVAILABLE) {
      Alert.alert(
        "Update Available",
        "A new app update has been downloaded. Please press 'OK' to use the latest version.",
        [
          {
            text: "OK",
            onPress: () => Updates.reloadAsync(),
            style: "default",
          },
        ]
      );
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

  if (!ready || !fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <NavigationContainer ref={navigationRef}>
        {registeredConferenceID != CONFERENCE_ID ? (
          <UserContext.Provider value={{ onUserRegistered: userRegistered }}>
            <WelcomeScreen />
          </UserContext.Provider>
        ) : (
          <ScheduleContext.Provider value={{ data: data, status: status, setData: setData, setStatus: setStatus }}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  switch (route.name) {
                    case "Home":
                      iconName = "home";
                      break;
                    case "Schedule":
                      iconName = "calendar";
                      break;
                    case "Announcements":
                      iconName = "bell";
                      break;
                    default:
                      iconName = "ellipsis-h";
                  }

                  return <Icon name={iconName} size={size} type="font-awesome-5" color={color} solid={focused} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: colors.neonBlue,
                inactiveTintColor: colors.midGrey,
                style: { backgroundColor: colors.black, opacity: 0.9, borderTopWidth: 0 },
              }}
              initialRouteName={initialRoute}
            >
              <Tab.Screen name="Home" component={HomeStack} />
              <Tab.Screen name="Schedule" component={ScheduleStack} />
              <Tab.Screen name="Announcements" component={AnnouncementsStack} />
              <Tab.Screen name="More" component={InfoStack} />
            </Tab.Navigator>
          </ScheduleContext.Provider>
        )}
        <FlashMessage position="top" />
      </NavigationContainer>
    </View>
  );
}
