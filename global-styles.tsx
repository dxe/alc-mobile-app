import { StyleSheet } from "react-native";
import { StackNavigationOptions } from "@react-navigation/stack";

export const colors = {
  // 2025 theme colors.
  lightGreen: "#EEFEE8",
  darkGreen: "#5B7045",
  orange: "#EFAD4B",
  // Neutral colors.
  white: "#FFFFFF",
  lightGrey: "#F4F4F4",
  midGrey: "#C4C4C4",
  mediumGrey: "#979797",
  darkGrey: "#323538",
  black: "#000000",
};

export const globalStyles = StyleSheet.create({
  h1: {
    fontFamily: "Inter-600",
    fontSize: 24,
    lineHeight: 29,
    color: colors.black,
  },
  h2: {
    fontFamily: "Inter-600",
    fontSize: 20,
    lineHeight: 24,
    color: colors.lightGreen,
  },
  textSmallMedium: {
    fontFamily: "Inter-500",
    fontSize: 12,
    lineHeight: 15,
    color: colors.orange,
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
    color: colors.black,
  },
  textSmallBoldUppercaseOrange: {
    fontFamily: "Inter-700",
    fontSize: 12,
    lineHeight: 15,
    color: colors.orange,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  textSmallBoldUppercaseGreen: {
    fontFamily: "Inter-700",
    fontSize: 12,
    lineHeight: 15,
    color: colors.lightGreen,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  textMediumRegular: {
    fontFamily: "Inter-400",
    fontSize: 14,
    lineHeight: 19,
    color: colors.lightGreen,
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
    color: colors.white,
  },
  textBody: {
    fontFamily: "Inter-400",
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGrey,
  },
  textButton: {
    fontFamily: "Inter-700",
    fontSize: 14,
    lineHeight: 17,
    color: colors.lightGreen,
  },
  buttonPrimaryOutline: {
    borderWidth: 2,
    borderColor: colors.darkGreen,
    backgroundColor: "transparent",
    borderRadius: 23,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: 140,
    minHeight: 50,
  },
  buttonPrimary: {
    backgroundColor: colors.darkGreen,
    borderRadius: 23,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: 140,
    minHeight: 50,
    borderWidth: 2,
    borderColor: colors.darkGreen,
  },
  textLabel: {
    fontFamily: "Inter-500",
    fontSize: 14,
    lineHeight: 17,
    color: colors.lightGreen,
    textTransform: "uppercase",
  },
  textHero: {
    color: colors.darkGreen,
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
  headerTintColor: colors.white,
  headerTitleStyle: [globalStyles.h2, { fontSize: 18 }],
  headerBackTitleStyle: [globalStyles.h2, { fontSize: 16 }],
  headerTransparent: false,
  headerStyle: {
    backgroundColor: colors.darkGreen,
    opacity: 1,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerBackTitleVisible: false,
};
