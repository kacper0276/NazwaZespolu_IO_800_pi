import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
