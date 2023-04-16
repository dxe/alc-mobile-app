import { StyleSheet } from "react-native";
import {
  StackNavigationOptions,
  HeaderStyleInterpolators,
} from "@react-navigation/stack";
import React from "react";

// New colors for 2023.
export const newColors = {
  lightGreen: "#4BAC5E",
  lightBlue: "#A6D8F6",
  darkGrey: "#292929",
  mediumGrey: "#404040",
};

export const colors = {
  white: "#FFFFFF",
  darkGrey: "#323538",
  midGrey: "#C4C4C4",
  black: "#000000",
  primary: newColors.lightGreen,
  orange: "#FF8937",
  lightBlue: newColors.lightBlue,
  darkestBlue: "#181441",
  lightGrey: "#F4F4F4",
  mediumGrey: "#979797",
  green: "#51A055",
};

export const globalStyles = StyleSheet.create({
  h1: {
    fontFamily: "Inter-600",
    fontSize: 24,
    lineHeight: 29,
    color: colors.white,
  },
  h2: {
    fontFamily: "Inter-600",
    fontSize: 20,
    lineHeight: 24,
    color: colors.lightBlue,
  },
  textSmallMedium: {
    fontFamily: "Inter-500",
    fontSize: 12,
    lineHeight: 15,
    color: colors.white,
  },
  textSmallRegular: {
    fontFamily: "Inter-400",
    fontSize: 12,
    lineHeight: 18,
    color: colors.white,
  },
  textLargeSemiBold: {
    fontFamily: "Inter-600",
    fontSize: 18,
    lineHeight: 24,
    color: colors.white,
  },
  textSmallSemiBold: {
    fontFamily: "Inter-600",
    fontSize: 12,
    lineHeight: 15,
    color: colors.white,
  },
  textSmallBoldUppercasePink: {
    fontFamily: "Inter-700",
    fontSize: 12,
    lineHeight: 15,
    color: colors.lightBlue,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  textSmallBoldUppercaseGreen: {
    fontFamily: "Inter-700",
    fontSize: 12,
    lineHeight: 15,
    color: colors.green,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  textMediumRegular: {
    fontFamily: "Inter-400",
    fontSize: 14,
    lineHeight: 19,
    color: colors.white,
  },
  textMediumMedium: {
    fontFamily: "Inter-500",
    fontSize: 14,
    lineHeight: 19,
    color: colors.white,
  },
  textMediumBold: {
    fontFamily: "Inter-700",
    fontSize: 14,
    lineHeight: 17,
    color: colors.white,
  },
  textBodyMedium: {
    fontFamily: "Inter-500",
    fontSize: 16,
    lineHeight: 24,
    color: colors.white,
  },
  textBody: {
    fontFamily: "Inter-400",
    fontSize: 16,
    lineHeight: 22,
    color: colors.white,
  },
  textButton: {
    fontFamily: "Inter-700",
    fontSize: 14,
    lineHeight: 17,
    color: colors.primary,
  },
  buttonPurpleOutline: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    borderRadius: 23,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: 140,
    minHeight: 50,
  },
  buttonPurple: {
    backgroundColor: colors.primary,
    borderRadius: 23,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: 140,
    minHeight: 50,
    borderWidth: 2,
    borderColor: colors.white,
  },
  textLabel: {
    fontFamily: "Inter-500",
    fontSize: 14,
    lineHeight: 17,
    color: colors.primary,
    textTransform: "uppercase",
  },
  textHero: {
    color: colors.lightBlue,
    fontFamily: "Inter-700",
    fontSize: 40,
    lineHeight: 53,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 20,
  },
});

export const screenHeaderOptions: StackNavigationOptions = {
  headerTintColor: colors.lightBlue,
  headerTitleStyle: [globalStyles.h2, { fontSize: 18 }],
  headerBackTitleStyle: [globalStyles.h2, { fontSize: 16 }],
  headerTransparent: false,
  headerStyle: {
    backgroundColor: newColors.darkGrey,
    opacity: 1,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerBackTitleVisible: false,
};
