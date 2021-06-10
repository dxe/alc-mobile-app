import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { ImageBackground, Text, View, Image, ScrollView, RefreshControl } from "react-native";
import { colors, styles } from "../styles";
import { Card } from "react-native-elements";
import { wait } from "../util";

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

  // TODO: refactor these cards into their own components (i.e. "HomeScreenCard")
  // TODO: if multiple events are at the same time (i.e. breakout sessions), we need to render multiple cards
  return (
    <ScrollView
      style={{ backgroundColor: colors.white }}
      contentContainerStyle={{ padding: 8 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={{ fontSize: 30, fontWeight: "bold", paddingTop: 5, paddingBottom: 15 }}>Happening now</Text>
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
          source={require("../assets/home-march.jpg")}
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
            <Text style={{ fontSize: 36, color: "white", fontWeight: "bold" }}>Registration & Coffee</Text>
          </View>
          <View style={{ position: "absolute", bottom: 0, left: 0, padding: 10 }}>
            <Text style={{ fontSize: 18, color: "white", fontWeight: "bold", marginBottom: 5 }}>
              2910 Shattuck Ave, Berkeley
            </Text>
            <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>Started 5 minutes ago</Text>
          </View>
        </View>
      </Card>

      <Text style={{ fontSize: 30, fontWeight: "bold", paddingTop: 5, paddingBottom: 15 }}>Coming up next</Text>
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
          source={require("../assets/home-community.jpg")}
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
            <Text style={{ fontSize: 36, color: "white", fontWeight: "bold" }}>Intro to Nonviolence</Text>
          </View>
          <View style={{ position: "absolute", bottom: 0, left: 0, padding: 10 }}>
            <Text style={{ fontSize: 18, color: "white", fontWeight: "bold", marginBottom: 5 }}>
              2910 Shattuck Ave, Berkeley
            </Text>
            <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>Starts in 1 hour</Text>
          </View>
        </View>
      </Card>

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
