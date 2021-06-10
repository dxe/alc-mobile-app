import { StyleSheet } from "react-native";

export const colors = {
  blue: "#335CCF",
  white: "#fff",
  grey: "#888",
  lightgrey: "#ccc",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
