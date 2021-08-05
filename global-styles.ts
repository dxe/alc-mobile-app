import { StyleSheet } from "react-native";
import { StackNavigationOptions } from "@react-navigation/stack";

export const colors = {
  primary: "#491887",
  white: "#FFF",
  grey: "#888",
  lightgrey: "#CCC",
  lightgreen: "#5CCC78",
  lightred: "#DB5E52",
};

export const globalStyles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
  },
  scrollView: {
    backgroundColor: colors.white,
  },
  scrollViewContentContainer: {
    padding: 8,
  },
  listItem: {
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 5,
    overflow: "hidden",
    borderColor: colors.lightgrey,
  },
  listItemTitle: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  buttonPrimary: {
    borderRadius: 30,
    height: 50,
    width: 150,
    backgroundColor: colors.primary,
    borderColor: colors.white,
    borderWidth: 2,
    alignSelf: "center",
  },
  buttonWhite: {
    borderRadius: 30,
    height: 50,
    width: 150,
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
    alignSelf: "center",
  },
});

export const screenHeaderOptions: StackNavigationOptions = {
  headerStyle: globalStyles.header,
  headerTintColor: colors.white,
  headerTitleStyle: {
    fontWeight: "bold",
  },
};
