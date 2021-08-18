import { StyleSheet } from "react-native";
import { StackNavigationOptions, HeaderStyleInterpolators } from "@react-navigation/stack";
import React from "react";

export const figmaColors = {
  white: "#FFFFFF",
  darkGrey: "#323538",
  midGrey: "#C4C4C4",
  black: "#000000",
  purple: "#3738AE",
  orange: "#FF5E37",
  neonPink: "#F891FC",
  neonBlue: "#A9F7F3",
};

export const figmaStyles = StyleSheet.create({
  h1: {
    fontFamily: "Inter-600",
    fontSize: 20,
    lineHeight: 24,
    color: figmaColors.white,
  },
  h2: {
    fontFamily: "Inter-600",
    fontSize: 20,
    lineHeight: 24,
    color: figmaColors.neonPink,
  },
  textSmallMedium: {
    fontFamily: "Inter-500",
    fontSize: 12,
    lineHeight: 14.5,
    color: figmaColors.darkGrey,
  },
  textSmallRegular: {
    fontFamily: "Inter-400",
    fontSize: 12,
    lineHeight: 18,
    color: figmaColors.darkGrey,
  },
  textLargeSemiBold: {
    fontFamily: "Inter-600",
    fontSize: 18,
    lineHeight: 24,
    color: figmaColors.black,
  },
  textSmallSemiBold: {
    fontFamily: "Inter-600",
    fontSize: 12,
    lineHeight: 15,
    color: figmaColors.black,
  },
  textMediumRegular: {
    fontFamily: "Inter-400",
    fontSize: 14,
    lineHeight: 19,
    color: figmaColors.darkGrey,
  },
});

export const colors = {
  primary: "#3738AE",
  hotpink: "#F476FB",
  lightblue: "#9BF7EF",
  white: "#FFF",
  grey: "#888",
  lightgrey: "#CCC",
  lightgreen: "#5CCC78",
  lightred: "#DB5E52",
};

export const globalStyles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.white,
  },
  scrollViewContentContainer: {
    padding: 12,
  },
  listItemTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 18,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 20,
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
  headerTintColor: figmaColors.neonPink,
  headerTitleStyle: [figmaStyles.h2, { fontSize: 18 }],
  headerBackTitleStyle: [figmaStyles.h2, { fontSize: 16 }],
  headerTransparent: false,
  headerStyle: {
    backgroundColor: figmaColors.black,
    opacity: 0.9,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
};
