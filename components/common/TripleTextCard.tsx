import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import { globalStyles } from "../../global-styles";

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
          borderRadius: 10,
          marginHorizontal: 0,
          marginVertical: 10,
        },
        globalStyles.shadow,
      ]}
    >
      <View>
        <View>
          {/*TODO: truncate text and put "..." if it's too long to fit on the cards*/}
          <Text style={{ fontSize: 12, marginBottom: 8 }}>{props.topElement}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 6 }}>{props.middleText}</Text>
          <Text style={{ fontSize: 14 }}>{props.bottomText}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({});
