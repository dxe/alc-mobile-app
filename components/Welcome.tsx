import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import { colors, globalStyles } from "../global-styles";
import {
  getDeviceID,
  logAnalyticsEvent,
  showErrorMessage,
  getOSName,
} from "../util";
import { Button } from "@rneui/base";
import { UserContext } from "../UserContext";
import { postAddUser } from "../api/user";
import { CONFERENCE_ID } from "../api/api";
import * as Device from "expo-device";
import { Video } from "expo-av";
import { getStatusBarHeight } from "react-native-status-bar-height";
//@ts-ignore
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { ResizeMode } from "../node_modules/expo-av/src/Video.types";

export function WelcomeScreen() {
  const { onUserRegistered } = useContext(UserContext);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
  } as formData);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const nameInput = useRef<TextInput | null>(null);
  const emailInput = useRef<TextInput | null>(null);

  interface formData {
    name: string;
    email: string;
    terms: boolean;
  }

  const validateForm = (): boolean => {
    if (!formData.name) {
      showErrorMessage("You must provide your name!");
      return false;
    }

    if (!formData.email) {
      showErrorMessage("You must provide your email address!");
      return false;
    }

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailOK = emailRegex.test(formData.email.toLowerCase());

    if (!emailOK) {
      showErrorMessage("You must enter a valid email address!");
      return false;
    }

    return true;
  };

  const submitRegistration = (
    includeFormData: boolean,
    callback: (deviceId: string, name: string) => unknown | Promise<unknown>
  ) => {
    setSubmitting(true);

    if (includeFormData) {
      const formValid = validateForm();
      if (!formValid) {
        setSubmitting(false);
        return;
      }
    }

    (async () => {
      try {
        const deviceID = await getDeviceID();
        const osName = getOSName();
        console.log(formData);
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
        showErrorMessage("Registration failed.");
        console.log(e);
        setSubmitting(false);
      }
    })();
  };

  return (
    <View style={{ flex: 1 }}>
      <Video
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        source={require("../assets/welcome-video.mp4")}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        status={{ shouldPlay: true, isMuted: true }}
      />

      <View
        style={{
          height: getStatusBarHeight(),
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />

      <View style={{ backgroundColor: "rgba(0,0,0,0.6)", flex: 1 }}>
        {submitting ? (
          <ActivityIndicator
            size="large"
            color={colors.white}
            style={{ flex: 1 }}
          />
        ) : (
          <KeyboardAwareScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
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
                <Text
                  style={[
                    globalStyles.textBodyMedium,
                    { color: colors.white, marginBottom: 4 },
                  ]}
                >
                  Name
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                  value={formData.name}
                  placeholder="Your name"
                  autoCapitalize={"words"}
                  keyboardType={"ascii-capable"}
                  autoComplete={"name"}
                  autoCorrect={false}
                  returnKeyType={"next"}
                  ref={nameInput}
                  onSubmitEditing={() => {
                    emailInput.current?.focus();
                  }}
                />
                <Text
                  style={[
                    globalStyles.textBodyMedium,
                    { color: colors.white, marginBottom: 4 },
                  ]}
                >
                  Email
                </Text>
                <TextInput
                  style={[styles.input, { marginBottom: 32 }]}
                  onChangeText={(value) =>
                    setFormData({ ...formData, email: value })
                  }
                  value={formData.email}
                  placeholder="Your email address"
                  autoCapitalize={"none"}
                  returnKeyType={"go"}
                  keyboardType={"email-address"}
                  autoComplete={"email"}
                  autoCorrect={false}
                  ref={emailInput}
                  onSubmitEditing={() => {
                    submitRegistration(true, onUserRegistered);
                  }}
                />
                <Button
                  titleStyle={[
                    globalStyles.textButton,
                    { color: colors.darkGreen },
                  ]}
                  buttonStyle={[
                    globalStyles.buttonPrimary,
                    { borderColor: colors.lightGreen },
                  ]}
                  onPress={() => {
                    logAnalyticsEvent("SignUpButtonTapped", 0, "");
                    submitRegistration(true, onUserRegistered);
                  }}
                  title="Sign Up"
                  disabled={submitting}
                />
              </View>
              <Button
                titleStyle={[globalStyles.textButton, { color: colors.orange }]}
                buttonStyle={[
                  globalStyles.buttonPrimary,
                  {
                    borderColor: "transparent",
                    backgroundColor: "transparent",
                  },
                ]}
                onPress={() => {
                  logAnalyticsEvent("SignUpAnonymousButtonTapped", 0, "");
                  submitRegistration(false, onUserRegistered);
                }}
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
