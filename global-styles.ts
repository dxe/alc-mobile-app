import { StyleSheet } from "react-native";
import { StackNavigationOptions } from "@react-navigation/stack";

export const colors = {
  primary: "#335CCF",
  white: "#FFF",
  grey: "#888",
  lightgrey: "#CCC",
  lightgreen: "#5CCC78",
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
});

export const screenHeaderOptions: StackNavigationOptions = {
  headerStyle: globalStyles.header,
  headerTintColor: colors.white,
  headerTitleStyle: {
    fontWeight: "bold",
  },
};
