import { ScrollView, View, Text, TextInput, SafeAreaView, StyleSheet, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { getDeviceID, showErrorMessage } from "../util";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, Overlay, CheckBox } from "react-native-elements";
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
          <SafeAreaView>
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
              <Button onPress={() => navigation.navigate("SignUp")} title="Sign up" />
              <Button onPress={() => registerAnon(onUserRegistered)} title="Stay anonymous" disabled={submitting} />
            </View>
          </SafeAreaView>
        </ScrollView>
      )}
    </UserContext.Consumer>
  );
}

export function SignUpScreen({ navigation, route }: any) {
  const [formData, setFormData] = React.useState({} as formData);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  interface formData {
    name: string;
    email: string;
    terms: boolean;
  }

  useEffect(() => {
    if (error === "") return;
    showErrorMessage(error);
    setError("");
  }, [error]);

  const submitRegistration = (callback: any) => {
    setSubmitting(true);

    if (!formData.name) {
      setError("You must provide your name!");
      setSubmitting(false);
      return;
    }

    if (!formData.email) {
      setError("You must provide your email address!");
      setSubmitting(false);
      return;
    }

    if (!formData.terms) {
      setError("You must accept the terms!");
      setSubmitting(false);
      return;
    }

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailOK = emailRegex.test(formData.email.toLowerCase());

    if (!emailOK) {
      setError("You must enter a valid email address!");
      setSubmitting(false);
      return;
    }

    (async () => {
      try {
        const deviceID = await getDeviceID();
        await postAddUser({
          conference_id: CONFERENCE_ID,
          name: formData.name,
          email: formData.email,
          device_name: Device.modelName || "",
          platform: Device.osName + " " + Device.osVersion,
        });
        setSubmitting(false);
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
        <ScrollView style={[globalStyles.scrollView]} contentContainerStyle={globalStyles.scrollViewContentContainer}>
          <View>
            <Text style={{ paddingBottom: 7 }}>Please provide your name and email.</Text>
            <Text style={{ paddingBottom: 14 }}>
              Your name will be publicly displayed if you choose to RSVP to events, but your email will not be made
              public.
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => setFormData({ ...formData, name: value })}
              value={formData.name}
              placeholder="Your name"
              autoCapitalize={"words"}
            />
            <TextInput
              style={styles.input}
              onChangeText={(value) => setFormData({ ...formData, email: value })}
              value={formData.email}
              placeholder="Your email address"
              autoCapitalize={"none"}
            />
            <Text>
              Please read the{" "}
              <Text
                style={{ color: colors.primary }}
                onPress={() => {
                  Linking.openURL("https://www.legacy.directactioneverywhere.com/alc-app-privacy-policy");
                }}
              >
                Privacy Policy
              </Text>
              .
            </Text>
            <CheckBox
              center
              title="Agree to Privacy Policy"
              checked={formData.terms}
              onPress={() => setFormData({ ...formData, terms: !formData.terms })}
            />
            <Button onPress={() => submitRegistration(onUserRegistered)} title="Sign up" disabled={submitting} />
          </View>
        </ScrollView>
      )}
    </UserContext.Consumer>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
