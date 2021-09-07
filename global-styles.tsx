import { StyleSheet } from "react-native";
import { StackNavigationOptions, HeaderStyleInterpolators } from "@react-navigation/stack";
import React from "react";

export const colors = {
  white: "#FFFFFF",
  darkGrey: "#323538",
  midGrey: "#C4C4C4",
  black: "#000000",
  purple: "#1B3DB7",
  orange: "#FF5E37",
  neonPink: "#F891FC",
  neonBlue: "#A9F7F3",
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
    color: colors.neonPink,
  },
  textSmallMedium: {
    fontFamily: "Inter-500",
    fontSize: 12,
    lineHeight: 15,
    color: colors.darkGrey,
  },
  textSmallRegular: {
    fontFamily: "Inter-400",
    fontSize: 12,
    lineHeight: 18,
    color: colors.darkGrey,
  },
  textLargeSemiBold: {
    fontFamily: "Inter-600",
    fontSize: 18,
    lineHeight: 24,
    color: colors.black,
  },
  textSmallSemiBold: {
    fontFamily: "Inter-600",
    fontSize: 12,
    lineHeight: 15,
    color: colors.black,
  },
  textSmallBoldUppercasePink: {
    fontFamily: "Inter-700",
    fontSize: 12,
    lineHeight: 15,
    color: colors.neonPink,
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
    color: colors.darkGrey,
  },
  textMediumMedium: {
    fontFamily: "Inter-500",
    fontSize: 14,
    lineHeight: 19,
    color: colors.darkGrey,
  },
  textMediumBold: {
    fontFamily: "Inter-700",
    fontSize: 14,
    lineHeight: 17,
    color: colors.darkGrey,
  },
  textBodyMedium: {
    fontFamily: "Inter-500",
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkestBlue,
  },
  textBody: {
    fontFamily: "Inter-400",
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkestBlue,
  },
  textButton: {
    fontFamily: "Inter-700",
    fontSize: 14,
    lineHeight: 17,
    color: colors.purple,
  },
  buttonPurpleOutline: {
    borderWidth: 2,
    borderColor: colors.purple,
    backgroundColor: colors.white,
    borderRadius: 23,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: 140,
    minHeight: 50,
  },
  buttonPurple: {
    backgroundColor: colors.purple,
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
    color: colors.purple,
    textTransform: "uppercase",
  },
  textHero: {
    color: colors.neonPink,
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
  headerTintColor: colors.neonPink,
  headerTitleStyle: [globalStyles.h2, { fontSize: 18 }],
  headerBackTitleStyle: [globalStyles.h2, { fontSize: 16 }],
  headerTransparent: false,
  headerStyle: {
    backgroundColor: colors.black,
    opacity: 1,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerBackTitleVisible: false,
};
