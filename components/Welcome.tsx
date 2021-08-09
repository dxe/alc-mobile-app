import { View, Text, TextInput, StyleSheet, Linking, Image, KeyboardAvoidingView, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { colors, globalStyles, screenHeaderOptions } from "../global-styles";
import { getDeviceID, showErrorMessage } from "../util";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, CheckBox } from "react-native-elements";
import { UserContext } from "../UserContext";
import { postAddUser } from "../api/user";
import { CONFERENCE_ID } from "../api/api";
import * as Device from "expo-device";
import { Video } from "expo-av";

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

export function WelcomeScreen({ navigation }: any) {
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { onUserRegistered } = useContext(UserContext);

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
        callback(deviceID, "");
      } catch (e) {
        setSubmitting(false);
        setError("Registration failed.");
      }
    })();
  };

  return (
    <View style={{ flex: 1 }}>
      <Video
        style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}
        source={require("../assets/welcome-video.mp4")}
        useNativeControls={false}
        resizeMode="cover"
        isLooping
        status={{ shouldPlay: true, isMuted: true }}
      />
      <View style={{ backgroundColor: "rgba(73,24,135,0.6)", flex: 1 }}>
        <View style={{ padding: 15, alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
          <Text
            style={{
              color: colors.white,
              fontSize: 60,
              fontWeight: "bold",
              textShadowColor: "blue",
              textShadowOffset: { width: -1, height: 4 },
              textShadowRadius: 1,
              shadowOpacity: 1,
            }}
          >
            Animal Liberation Conference
          </Text>
        </View>
        <View style={{ padding: 15, alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
          <Button
            titleStyle={{ color: colors.primary, fontWeight: "bold" }}
            buttonStyle={[globalStyles.buttonWhite, { width: 200 }]}
            onPress={() => navigation.navigate("SignUp")}
            title="Sign up"
          />
          <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
            <View style={{ flex: 2, borderBottomWidth: 2, borderBottomColor: colors.white }} />
            <Text style={{ flex: 1, color: colors.white, fontWeight: "bold", textAlign: "center" }}>OR</Text>
            <View style={{ flex: 2, borderBottomWidth: 2, borderBottomColor: colors.white }} />
          </View>
          <Button
            titleStyle={{ color: colors.white, fontWeight: "bold" }}
            buttonStyle={[globalStyles.buttonPrimary, { width: 200 }]}
            onPress={() => registerAnon(onUserRegistered)}
            title="Stay anonymous"
            disabled={submitting}
          />
        </View>
      </View>
    </View>
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
          name: formData.name.trim(),
          email: formData.email.trim(),
          device_name: Device.modelName || "",
          platform: Device.osName + " " + Device.osVersion,
        });
        setSubmitting(false);
        callback(deviceID, formData.name.trim());
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
        <KeyboardAvoidingView
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-evenly",
            backgroundColor: colors.white,
          }}
          behavior={"position"}
        >
          <Image
            source={require("../assets/logo-circle-black.png")}
            style={{ height: 200, width: 205, resizeMode: "stretch", alignSelf: "center", marginVertical: 10 }}
          />
          <Text style={{ paddingHorizontal: 10 }}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setFormData({ ...formData, name: value })}
            value={formData.name}
            placeholder="Your name"
            autoCapitalize={"words"}
            keyboardType={"ascii-capable"}
            autoCompleteType={"name"}
            autoCorrect={false}
          />
          <Text style={{ paddingHorizontal: 10 }}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
            value={formData.email}
            placeholder="Your email address"
            autoCapitalize={"none"}
            returnKeyLabel={"OK"}
            keyboardType={"email-address"}
            autoCompleteType={"email"}
            autoCorrect={false}
          />
          <Text style={{ paddingHorizontal: 10 }}>
            Please read the{" "}
            <Text
              style={{ color: colors.primary, fontWeight: "bold" }}
              onPress={() => {
                Linking.openURL("https://www.legacy.directactioneverywhere.com/alc-app-privacy-policy");
              }}
            >
              Privacy Policy
            </Text>
            . By signing up, your name will be visible to other users of the app.
          </Text>
          <CheckBox
            center
            title="Agree to Privacy Policy"
            checked={formData.terms}
            onPress={() => setFormData({ ...formData, terms: !formData.terms })}
          />
          <Button
            titleStyle={{ color: colors.white, fontWeight: "bold" }}
            buttonStyle={[globalStyles.buttonPrimary, { margin: 8 }]}
            onPress={() => submitRegistration(onUserRegistered)}
            title="Sign up"
            disabled={submitting}
          />
        </KeyboardAvoidingView>
      )}
    </UserContext.Consumer>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 10,
    marginBottom: 12,
    marginTop: 5,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  image: {
    resizeMode: "cover",
  },
});
