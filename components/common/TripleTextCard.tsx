import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-elements";
import { colors, globalStyles } from "../../global-styles";
import { ConferenceEvent } from "../../api/schedule";
import { NavigationProp } from "@react-navigation/native";
import { logAnalyticsEvent } from "../../util";

interface Props {
  middleText: string;
  topElement: React.ReactElement;
  bottomText: string;
  navigation: NavigationProp<any>;
  scheduleItem: ConferenceEvent;
}

export function TripleTextCard(props: Props) {
  return (
    <Card
      containerStyle={[
        {
          flex: 1,
          backgroundColor: colors.white,
          borderRadius: 8,
          marginVertical: 16,
          marginHorizontal: 0,
          padding: 12,
        },
        globalStyles.shadow,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          logAnalyticsEvent("TripleTextCardTapped", props.scheduleItem.id, props.scheduleItem.name);
          props.navigation.navigate("Event Details", { scheduleItem: props.scheduleItem });
        }}
      >
        <View>
          <View>
            <Text style={[globalStyles.textSmallMedium, { marginBottom: 8 }]}>{props.topElement}</Text>
          </View>
          <View>
            <Text style={[globalStyles.textLargeSemiBold, { marginBottom: 2 }]}>{props.middleText}</Text>
            <Text style={globalStyles.textMediumRegular}>{props.bottomText}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
