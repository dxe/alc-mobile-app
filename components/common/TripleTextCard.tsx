import React from "react";
import { ImageBackground, Text, View, Image, ScrollView, RefreshControl } from "react-native";
import { Card } from "react-native-elements";

interface Props {
	imageSource: string;
	topText: string;
	middleText;
	bottomText: string;
}

export function TripleTextCard(props: Props) {
	return (
		<Card
		  containerStyle={{
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
		  }}
		>
		  <ImageBackground
		    style={{
		      width: "100%",
		      height: "100%",
		      padding: 0,
		    }}
		    imageStyle={{
		      resizeMode: "cover",
		      width: "100%",
		      height: "100%",
		      padding: 0,
		      margin: 0,
		      borderRadius: 15,
		    }}
		    source={props.imageSource}
		  />
		  <View
		    style={{
		      position: "absolute",
		      top: 0,
		      left: 0,
		      width: "100%",
		      height: "100%",
		      borderRadius: 15,
		      backgroundColor: "rgba(0,0,0,0.45)",
		    }}
		  >
		    <View style={{ position: "absolute", top: 0, left: 0, padding: 10 }}>
		      {/*TODO: truncate text and put "..." if it's too long to fit on the cards*/}
		      <Text style={{ fontSize: 36, color: "white", fontWeight: "bold" }}>{props.topText}</Text>
		    </View>
		    <View style={{ position: "absolute", bottom: 0, left: 0, padding: 10 }}>
		      <Text style={{ fontSize: 18, color: "white", fontWeight: "bold", marginBottom: 5 }}>
		        {props.middleText}
		      </Text>
		      <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>{props.bottomText}</Text>
		    </View>
		  </View>
		</Card>
	);
}