import React from "react";
import { Text, View } from "react-native";
import { Card } from "react-native-elements";
import { figmaColors, figmaStyles, globalStyles } from "../../global-styles";

interface Props {
  middleText: string;
  topElement: React.ReactElement;
  bottomText: string;
}

export function TripleTextCard(props: Props) {
  return (
    <Card
      containerStyle={[
        {
          flex: 1,
          backgroundColor: figmaColors.white,
          borderRadius: 8,
          marginVertical: 16,
          marginHorizontal: 0,
          padding: 12,
        },
        globalStyles.shadow,
      ]}
    >
      <View>
        <View>
          <Text style={[figmaStyles.textSmallMedium, { marginBottom: 8 }]}>{props.topElement}</Text>
        </View>
        <View>
          <Text style={[figmaStyles.textLargeSemiBold, { marginBottom: 2 }]}>{props.middleText}</Text>
          <Text style={figmaStyles.textMediumRegular}>{props.bottomText}</Text>
        </View>
      </View>
    </Card>
  );
}
