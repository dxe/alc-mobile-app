import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { ImageBackground, Text, View, Image, ScrollView } from "react-native";
import { colors, styles } from "../styles";
import { Card } from "react-native-elements";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Animal Liberation Conference",
          headerStyle: {
            backgroundColor: colors.blue,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
}

function HomeScreen() {
  // TODO: refactor these cards into their own components (i.e. "HomeScreenCard")
  // TODO: fix scrolling bug
  return (
    <ScrollView
      style={{ backgroundColor: colors.white }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        padding: 8,
      }}
    >
      {/*TODO: cards should link to various screens in the app*/}
      <Card containerStyle={{ width: "100%", height: "25%", borderRadius: 15, borderWidth: 0, padding: 0 }}>
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
          source={require("../assets/home-calendar.jpg")}
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
        ></View>
        <View style={{ position: "absolute", top: 10, left: 10 }}>
          <Text style={{ fontSize: 40, color: "white", fontWeight: "bold" }}>Schedule</Text>
        </View>
      </Card>

      <Card containerStyle={{ width: "100%", height: "25%", borderRadius: 15, borderWidth: 0, padding: 0 }}>
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
          source={require("../assets/home-mic.jpg")}
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
        ></View>
        <View style={{ position: "absolute", top: 10, left: 10 }}>
          <Text style={{ fontSize: 40, color: "white", fontWeight: "bold" }}>Speakers</Text>
        </View>
      </Card>

      {/*TODO: "key events" should load dynamically & be in 2 columns*/}
      {/*<View>*/}
      {/*  <Text style={{fontWeight: 'bold'}}>Key Events</Text>*/}
      {/*  <Text>1</Text>*/}
      {/*  <Text>2</Text>*/}
      {/*  <Text>3</Text>*/}
      {/*  <Text>4</Text>*/}
      {/*</View>*/}

      <Card containerStyle={{ width: "100%", height: "25%", borderRadius: 15, borderWidth: 0, padding: 0 }}>
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
          source={require("../assets/home-chant.jpg")}
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
        ></View>
        <View style={{ position: "absolute", top: 10, left: 10 }}>
          <Text style={{ fontSize: 40, color: "white", fontWeight: "bold" }}>Chants & Lyrics</Text>
        </View>
      </Card>

      <Card containerStyle={{ width: "100%", height: "25%", borderRadius: 15, borderWidth: 0, padding: 0 }}>
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
          source={require("../assets/home-contact.jpg")}
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
        ></View>
        <View style={{ position: "absolute", top: 10, left: 10 }}>
          <Text style={{ fontSize: 40, color: "white", fontWeight: "bold" }}>Contact Us</Text>
        </View>
      </Card>
    </ScrollView>
  );
}
