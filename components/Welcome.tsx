import { ScrollView, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { getDeviceID, showErrorMessage } from "../util";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, Overlay } from "react-native-elements";
import { UserContext } from "../UserContext";
import { postAddUser } from "../api/user";
import { CONFERENCE_ID } from "../api/api";
import * as Device from "expo-device";

const Stack = createStackNavigator();

export default function WelcomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          ...screenHeaderOptions,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          ...screenHeaderOptions,
          title: "Sign Up",
        }}
      />
    </Stack.Navigator>
  );
}

export function WelcomeScreen({ navigation, route }: any) {
  const [overlayVisible, setOverlayVisible] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (error === "") return;
    showErrorMessage(error);
    setError("");
  }, [error]);

  const registerAnon = (callback: any) => {
    (async () => {
      setSubmitting(true);
      try {
        const deviceID = await getDeviceID();
        await postAddUser({
          conference_id: CONFERENCE_ID,
          name: "",
          email: "",
          device_name: Device.modelName || "",
          platform: Device.osName + " " + Device.osVersion,
        });
        callback(deviceID);
      } catch (e) {
        setSubmitting(false);
        setError("Registration failed.");
      }
    })();
  };

  return (
    <UserContext.Consumer>
      {({ onUserRegistered }) => (
        // TODO: design this screen
        <ScrollView
          style={[globalStyles.scrollView, { backgroundColor: colors.primary }]}
          contentContainerStyle={globalStyles.scrollViewContentContainer}
        >
          <Overlay
            isVisible={overlayVisible}
            onBackdropPress={() => setOverlayVisible(false)}
            overlayStyle={{ padding: 20, margin: 20 }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Hello from the Organizers!</Text>
            <Text style={{ marginBottom: 10 }}>
              Welcome to the Animal Liberation Conference! You can use this app to keep track of the schedule, receive
              important announcements, and more!
            </Text>
            <Text style={{ marginBottom: 20 }}>
              We encourage you to sign up to make it easier to network with other activists. If you choose to sign up,
              your name will be visible to all users of the app.
            </Text>
            <Button title="Got it!" onPress={() => setOverlayVisible(false)} />
          </Overlay>
          <View>
            <Text>Welcome to ALC 2021!</Text>
            <Button onPress={() => navigation.navigate("SignUp")} title="Sign up" />
            <Button onPress={() => registerAnon(onUserRegistered)} title="Stay anonymous" disabled={submitting} />
          </View>
        </ScrollView>
      )}
    </UserContext.Consumer>
  );
}

export function SignUpScreen({ navigation, route }: any) {
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (error === "") return;
    showErrorMessage(error);
    setError("");
  }, [error]);

  const register = (callback: any) => {
    setSubmitting(true);
    (async () => {
      try {
        const deviceID = await getDeviceID();
        await postAddUser({
          conference_id: CONFERENCE_ID,
          name: "Test Name", // TODO: use form fields
          email: "email@test.com", // TODO: use form fields
          device_name: Device.modelName || "",
          platform: Device.osName + " " + Device.osVersion,
        });
        callback(deviceID);
      } catch (e) {
        setError("Registration failed.");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <UserContext.Consumer>
      {({ onUserRegistered }) => (
        // TODO: design this screen
        <ScrollView style={[globalStyles.scrollView]} contentContainerStyle={globalStyles.scrollViewContentContainer}>
          <View>
            <Text>Provide your name and email.</Text>
            <Button onPress={() => register(onUserRegistered)} title="Sign up" disabled={submitting} />
          </View>
        </ScrollView>
      )}
    </UserContext.Consumer>
  );
}
