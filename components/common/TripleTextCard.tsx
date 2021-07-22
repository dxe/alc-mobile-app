import React from "react";
import { ImageBackground, Text, View, StyleSheet } from "react-native";
import { Card } from "react-native-elements";

// TODO: Consider storing the fallback image locally in case someone has no Internet connection.
const FALLBACK_IMAGE = "https://alc-img.s3.us-west-2.amazonaws.com/home-march.jpg.1626905834..jpg";

interface Props {
  imageSource: string | null;
  topText: string;
  middleText: string;
  bottomElement: React.ReactElement;
}

export function TripleTextCard(props: Props) {
  return (
    <Card containerStyle={styles.cardContainer}>
      {/*TODO: maybe fallback to a local image here if the source fails to load or is empty? or just use a solid color?*/}
      <ImageBackground
        style={styles.imageBackground}
        imageStyle={styles.image}
        source={{ uri: props.imageSource || FALLBACK_IMAGE }}
      />
      <View style={styles.textWrapperView}>
        <View style={styles.topView}>
          {/*TODO: truncate text and put "..." if it's too long to fit on the cards*/}
          <Text style={{ ...styles.text, fontSize: 36 }}>{props.topText}</Text>
        </View>
        <View style={styles.bottomView}>
          <Text style={{ ...styles.text, fontSize: 18 }}>{props.middleText}</Text>
          <Text style={{ ...styles.text, fontSize: 12 }}>{props.bottomElement}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    height: 175,
    borderRadius: 15,
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
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
    backgroundColor: "rgba(0,0,0,0.45)",
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
  text: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
});
