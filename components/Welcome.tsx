import { View, Text, TextInput, StyleSheet, Image, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { colors, globalStyles } from "../global-styles";
import { getDeviceID, showErrorMessage } from "../util";
import { Button } from "react-native-elements";
import { UserContext } from "../UserContext";
import { postAddUser } from "../api/user";
import { CONFERENCE_ID } from "../api/api";
import * as Device from "expo-device";
import { Video } from "expo-av";
import { getStatusBarHeight } from "react-native-status-bar-height";
//@ts-ignore
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

export function WelcomeScreen() {
  const { onUserRegistered } = useContext(UserContext);
  const [formData, setFormData] = React.useState({} as formData);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const nameInput = useRef<TextInput | null>(null);
  const emailInput = useRef<TextInput | null>(null);

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
        const osName = Device.osName === "iOS" || Device.osName === "iPadOS" ? Device.osName : "Android";
        await postAddUser({
          conference_id: CONFERENCE_ID,
          name: formData.name.trim(),
          email: formData.email.trim(),
          device_name: Device.modelName || "",
          platform: osName + " " + Device.osVersion,
        });
        setSubmitting(false);
        callback(deviceID, formData.name.trim());
      } catch (e) {
        setSubmitting(false);
        setError("Registration failed.");
      }
    })();
  };

  // TODO: refactor this to be handled by the submitRegistration function to avoid code duplication
  const registerAnon = (callback: any) => {
    (async () => {
      setSubmitting(true);
      try {
        const deviceID = await getDeviceID();
        const osName = Device.osName === "iOS" || Device.osName === "iPadOS" ? Device.osName : "Android";
        await postAddUser({
          conference_id: CONFERENCE_ID,
          name: "",
          email: "",
          device_name: Device.modelName || "",
          platform: osName + " " + Device.osVersion,
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

      <View style={{ height: getStatusBarHeight(), backgroundColor: "rgba(0,0,0,0.6)" }} />

      <View style={{ backgroundColor: "rgba(0,0,0,0.6)", flex: 1 }}>
        {submitting ? (
          <ActivityIndicator size="large" color={colors.white} style={{ flex: 1 }} />
        ) : (
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                width: "80%",
                maxWidth: 350,
                justifyContent: "space-evenly",
              }}
            >
              <Image
                source={require("../assets/logo-circle-shadow.png")}
                style={{
                  height: 250,
                  resizeMode: "contain",
                }}
              />
              <View style={{ width: "100%" }}>
                <Text style={[globalStyles.textBodyMedium, { color: colors.white, marginBottom: 4 }]}>Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => setFormData({ ...formData, name: value })}
                  value={formData.name}
                  placeholder="Your name"
                  autoCapitalize={"words"}
                  keyboardType={"ascii-capable"}
                  autoCompleteType={"name"}
                  autoCorrect={false}
                  returnKeyType={"next"}
                  ref={nameInput}
                  onSubmitEditing={() => {
                    emailInput.current?.focus();
                  }}
                />
                <Text style={[globalStyles.textBodyMedium, { color: colors.white, marginBottom: 4 }]}>Email</Text>
                <TextInput
                  style={[styles.input, { marginBottom: 32 }]}
                  onChangeText={(value) => setFormData({ ...formData, email: value })}
                  value={formData.email}
                  placeholder="Your email address"
                  autoCapitalize={"none"}
                  returnKeyType={"go"}
                  keyboardType={"email-address"}
                  autoCompleteType={"email"}
                  autoCorrect={false}
                  ref={emailInput}
                  onSubmitEditing={() => {
                    submitRegistration(onUserRegistered);
                  }}
                />
                <Button
                  titleStyle={[globalStyles.textButton, { color: colors.white }]}
                  buttonStyle={[globalStyles.buttonPurple, { borderColor: colors.purple }]}
                  onPress={() => submitRegistration(onUserRegistered)}
                  title="Sign Up"
                  disabled={submitting}
                />
              </View>
              <Button
                titleStyle={[globalStyles.textButton, { color: colors.neonBlue }]}
                buttonStyle={[
                  globalStyles.buttonPurple,
                  { borderColor: "transparent", backgroundColor: "transparent" },
                ]}
                onPress={() => registerAnon(onUserRegistered)}
                title="Skip to Stay Anonymous"
                disabled={submitting}
              />
            </View>
          </KeyboardAwareScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: colors.midGrey,
    marginBottom: 24,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  image: {
    resizeMode: "cover",
  },
});
