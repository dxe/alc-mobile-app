import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, globalStyles } from "../global-styles";
import { showMessage } from "react-native-flash-message";
import { storeJSON } from "../util";
import { CONFERENCE_ID } from "../api/api";

interface Props {
  onSuccess: () => any;
}

export default function WelcomeScreen(props: Props) {
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!isError) return;
    showMessage({
      message: "Error",
      description: "Unable to submit form.",
      type: "danger",
    });
    setIsError((v: boolean) => {
      return !v;
    });
  }, [isError]);

  const register = () => {
    (async () => {
      // TODO: submit form
      // TODO: register for push notifications
      await storeJSON("registered_conference_id", CONFERENCE_ID);
      props.onSuccess();
    })();
  };

  const registerAnon = () => {
    (async () => {
      // TODO: register for push notifications
      await storeJSON("registered_conference_id", CONFERENCE_ID);
      props.onSuccess();
    })();
  };

  return (
    // TODO: design this screen
    <ScrollView
      style={[globalStyles.scrollView, { backgroundColor: colors.primary, paddingTop: 20 }]}
      contentContainerStyle={globalStyles.scrollViewContentContainer}
    >
      <View>
        <Text style={{ color: colors.white }}>Welcome to ALC 2021!</Text>
        <Text>Name field</Text>
        <Text>Email field</Text>
        <TouchableOpacity activeOpacity={0.5} onPress={register}>
          <Text style={{ color: colors.white }}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={registerAnon}>
          <Text style={{ color: colors.white }}>Stay anonymous</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
