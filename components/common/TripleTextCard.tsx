import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Card } from "react-native-elements";

interface Props {
  middleText: string;
  topElement: React.ReactElement;
  bottomText: string;
}

export function TripleTextCard(props: Props) {
  return (
    <Card
      containerStyle={{
        flex: 1,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 20,
      }}
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

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 20,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    padding: 0,
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
    borderRadius: 15,
  },
  textWrapperView: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: "rgba(42,34,157,0.8)",
  },
  topView: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: 10,
  },
});
