import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text, View, ScrollView, RefreshControl } from "react-native";
import { colors } from "../styles";
import { Card } from "react-native-elements";
import { wait } from "../util";
import { TripleTextCard } from "./common/TripleTextCard";

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
  const [refreshing, setRefreshing] = React.useState(false);

  // TODO: implement fetching data from server & caching
  const onRefresh = () => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.white }}
      contentContainerStyle={{ padding: 8 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={{ fontSize: 30, fontWeight: "bold", paddingTop: 5, paddingBottom: 15 }}>Happening now</Text>
      <TripleTextCard
        imageSource={require("../assets/home-march.jpg")}
        topText={"Registration & Coffee"}
        middleText={"2910 Shattuck Ave, Berkeley"}
        bottomText={"Started 5 minutes ago"}
      />

      <Text style={{ fontSize: 30, fontWeight: "bold", paddingTop: 5, paddingBottom: 15 }}>Coming up next</Text>
      <TripleTextCard
        imageSource={require("../assets/home-community.jpg")}
        topText={"Intro to Nonviolence"}
        middleText={"2910 Shattuck Ave, Berkeley"}
        bottomText={"Starts in 1 hour"}
      />

      <Text style={{ fontSize: 30, fontWeight: "bold", paddingTop: 5, paddingBottom: 15 }}>Key events</Text>
      <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        <Card
          containerStyle={{
            width: "49%",
            height: 125,
            borderRadius: 15,
            borderWidth: 0,
            padding: 0,
            margin: 0,
            marginBottom: 8,
            backgroundColor: "orange",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          }}
        >
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
            <View style={{ position: "absolute", top: 0, left: 0 }}>
              <Text style={{ fontSize: 36, color: "white", fontWeight: "bold", padding: 10 }}>Some event</Text>
            </View>
          </View>
        </Card>

        <Card
          containerStyle={{
            width: "49%",
            height: 125,
            borderRadius: 15,
            borderWidth: 0,
            padding: 0,
            margin: 0,
            marginBottom: 8,
            backgroundColor: "orange",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          }}
        >
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
            <View style={{ position: "absolute", top: 0, left: 0 }}>
              <Text style={{ fontSize: 36, color: "white", fontWeight: "bold", padding: 10 }}>Some event</Text>
            </View>
          </View>
        </Card>

        <Card
          containerStyle={{
            width: "49%",
            height: 125,
            borderRadius: 15,
            borderWidth: 0,
            padding: 0,
            margin: 0,
            marginBottom: 8,
            backgroundColor: "orange",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          }}
        >
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
            <View style={{ position: "absolute", top: 0, left: 0 }}>
              <Text style={{ fontSize: 36, color: "white", fontWeight: "bold", padding: 10 }}>Some event</Text>
            </View>
          </View>
        </Card>

        <Card
          containerStyle={{
            width: "49%",
            height: 125,
            borderRadius: 15,
            borderWidth: 0,
            padding: 0,
            margin: 0,
            marginBottom: 8,
            backgroundColor: "orange",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          }}
        >
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
            <View style={{ position: "absolute", top: 0, left: 0 }}>
              <Text style={{ fontSize: 36, color: "white", fontWeight: "bold", padding: 10 }}>Some event</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
