import React, { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar, View } from "react-native";
import { NavigationContainer, NavigationContainerRef, StackActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./components/Home";
import ScheduleStack from "./components/Schedule";
import AnnouncementsStack from "./components/Announcements";
import InfoStack from "./components/Info";
import { colors } from "./global-styles";
import FlashMessage from "react-native-flash-message";
import {
  getOSName,
  getStoredJSON,
  logAnalyticsEvent,
  logAnalyticsScreenChange,
  registerForPushNotificationsAsync,
  storeJSON,
} from "./util";
import { WelcomeScreen } from "./components/Welcome";
import { CONFERENCE_ID } from "./api/api";
import { UserContext } from "./UserContext";
import { postRegisterPushNotifications } from "./api/user";
import { useSchedule } from "./api/schedule";
import { ScheduleContext } from "./ScheduleContext";
import { InfoContext } from "./InfoContext";
import * as Notifications from "expo-notifications";
import { Icon } from "@rneui/base";
import { useFonts } from "expo-font";
import * as Device from "expo-device";
import * as SplashScreen from "expo-splash-screen";
import { NotificationResponse } from "expo-notifications";
import { useInfo } from "./api/info";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// How to handle notifications when app is in foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Function to fire when a tab navigation event occurs.
// This is used to reset the navigation stack on a screen component
// when navigating to another screen component on Android, since that
// is the expected default behavior for the Android OS.
export const _tabNavigationListener = (props: any) => {
  if (getOSName() !== "Android") return {};
  const { navigation } = props;
  return {
    blur: (e: any) => {
      const target = e.target;
      const state = navigation.dangerouslyGetState();
      const route = state.routes.find((r: any) => r.key === target);
      // If we are leaving a tab that has its own stack navigation, then clear it.
      if (route.state?.type === "stack" && route.state.routes?.length > 1) {
        navigation.dispatch(StackActions.popToTop());
      }
    },
  };
};

const Tab = createBottomTabNavigator();

export default function App() {
  const [registeredConferenceID, setRegisteredConferenceID] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const { data, setData, status, setStatus } = useSchedule(null);
  const { data: infoData, status: infoStatus, setStatus: setInfoStatus } = useInfo([]);
  const [notification, setNotification] = useState(null);
  const navigationRef = useRef<NavigationContainerRef>(null);
  const routeNameRef = useRef();
  const [initialRouteName, setInitialRouteName] = useState("Home");
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  let [isFontsLoaded] = useFonts({
    "Inter-400": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-500": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-600": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Inter-700": require("./assets/fonts/Inter-Bold.ttf"),
  });

  StatusBar.setBarStyle("light-content", true);
  if (Device.brand != "Apple") {
    StatusBar.setBackgroundColor("#00000000");
  }

  useEffect(() => {
    // To handle when a notification is tapped.
    _handleNotificationResponse(lastNotificationResponse);
  }, [lastNotificationResponse]);

  useEffect(() => {
    (async () => {
      const user = await getStoredJSON("user");
      const id = user?.conference;
      setRegisteredConferenceID(id ? id : 0);
      setIsReady(true);
    })();

    // Fires when a notification is received when app is in foreground.
    const subscription = Notifications.addNotificationReceivedListener(_handleNotification);
    return () => subscription.remove();
  }, []);

  const _handleNotification = (notification: any) => {
    setNotification(notification);
  };

  const _handleNotificationResponse = (response: NotificationResponse | undefined | null) => {
    if (response === undefined || response === null) return;

    (async () => {
      const lastNotificationDate = await getStoredJSON("last_notification_date");

      if (!lastNotificationDate || response.notification?.date > lastNotificationDate) {
        const notificationTitle = response?.notification?.request?.content?.title || "";
        logAnalyticsEvent("NotificationTapped", 0, notificationTitle);
        if (navigationRef.current) {
          navigationRef.current.navigate("Announcements");
        } else {
          setInitialRouteName("Announcements");
        }
      }

      await storeJSON("last_notification_date", response.notification.date);
    })();
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
      }
    })();
  };

  const onLayoutRootView = useCallback(async () => {
    if (isReady && isFontsLoaded) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isReady, isFontsLoaded]);

  if (!isReady || !isFontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.black }} onLayout={onLayoutRootView}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => logAnalyticsScreenChange(initialRouteName)}
        onStateChange={() => {
          logAnalyticsScreenChange(navigationRef.current?.getCurrentRoute()?.name);
        }}
      >
        {registeredConferenceID != CONFERENCE_ID ? (
          <UserContext.Provider value={{ onUserRegistered: userRegistered }}>
            <WelcomeScreen />
          </UserContext.Provider>
        ) : (
          <ScheduleContext.Provider
            value={{
              data: data,
              status: status,
              setData: setData,
              setStatus: setStatus,
            }}
          >
            <InfoContext.Provider
              value={{
                data: infoData,
                status: infoStatus,
                setStatus: setInfoStatus,
              }}
            >
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
                  activeTintColor: colors.darkGreen,
                  inactiveTintColor: colors.mediumGrey,
                  style: {
                    backgroundColor: colors.white,
                    borderTopColor: colors.lightGrey,
                    // opacity: 0.9,
                    borderTopWidth: 2,
                  },
                }}
                initialRouteName={initialRouteName}
              >
                <Tab.Screen
                  name="Home"
                  component={HomeStack}
                  listeners={(props) => _tabNavigationListener({ ...props })}
                />
                <Tab.Screen
                  name="Schedule"
                  component={ScheduleStack}
                  listeners={(props) => _tabNavigationListener({ ...props })}
                />
                <Tab.Screen
                  name="Announcements"
                  component={AnnouncementsStack}
                  listeners={(props) => _tabNavigationListener({ ...props })}
                />
                <Tab.Screen
                  name="More"
                  component={InfoStack}
                  listeners={(props) => _tabNavigationListener({ ...props })}
                />
              </Tab.Navigator>
            </InfoContext.Provider>
          </ScheduleContext.Provider>
        )}
        <FlashMessage position="top" />
      </NavigationContainer>
    </View>
  );
}
