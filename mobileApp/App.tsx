import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "./const/index";

export const API_URL = "http://localhost:3001";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Witam</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.main,
    alignItems: "center",
    justifyContent: "center",
  },
});
