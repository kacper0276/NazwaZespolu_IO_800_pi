import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../const/index";

export default function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>To jest ekran szczegółów!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.main,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "#fff",
  },
  link: {
    marginTop: 20,
    fontSize: 18,
    color: "blue",
    textDecorationLine: "underline",
  },
});
