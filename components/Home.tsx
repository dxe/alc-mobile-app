import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text, View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { colors, screenHeaderOptions, globalStyles } from "../global-styles";
import { Card } from "react-native-elements";
import { wait } from "../util";
import { TripleTextCard } from "./common/TripleTextCard";
import { EventDetails } from "./EventDetails";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          ...screenHeaderOptions,
          title: "Animal Liberation Conference",
        }}
      />
      <Stack.Screen
        name="Event Details"
        component={EventDetails}
        options={{
          ...screenHeaderOptions,
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
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.scrollViewContentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.heading}>Happening now</Text>
      <TripleTextCard
        imageSource={require("../assets/home-march.jpg")}
        topText={"Registration & Coffee"}
        middleText={"2910 Shattuck Ave, Berkeley"}
        bottomText={"Started 5 minutes ago"}
      />

      <Text style={styles.heading}>Coming up next</Text>
      <TripleTextCard
        imageSource={require("../assets/home-community.jpg")}
        topText={"Intro to Nonviolence"}
        middleText={"2910 Shattuck Ave, Berkeley"}
        bottomText={"Starts in 1 hour"}
      />

      <Text style={styles.heading}>Key events</Text>
      <View style={styles.keyEventsView}>
        <Card containerStyle={styles.keyEventCard}>
          <View style={styles.keyEventView}>
            <View style={styles.keyEventInnerView}>
              <Text style={styles.keyEventText}>Some event</Text>
            </View>
          </View>
        </Card>

        <Card containerStyle={styles.keyEventCard}>
          <View style={styles.keyEventView}>
            <View style={styles.keyEventInnerView}>
              <Text style={styles.keyEventText}>Some event</Text>
            </View>
          </View>
        </Card>

        <Card containerStyle={styles.keyEventCard}>
          <View style={styles.keyEventView}>
            <View style={styles.keyEventInnerView}>
              <Text style={styles.keyEventText}>Some event</Text>
            </View>
          </View>
        </Card>

        <Card containerStyle={styles.keyEventCard}>
          <View style={styles.keyEventView}>
            <View style={styles.keyEventInnerView}>
              <Text style={styles.keyEventText}>Some event</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    paddingTop: 5,
    paddingBottom: 15,
  },
  keyEventsView: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  keyEventCard: {
    width: "49%",
    height: 125,
    borderRadius: 15,
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginBottom: 8,
    backgroundColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  keyEventView: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  keyEventInnerView: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  keyEventText: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
    padding: 10,
  },
});
