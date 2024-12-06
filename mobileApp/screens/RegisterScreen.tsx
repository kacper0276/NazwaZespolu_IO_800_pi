import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

const RegisterScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/ForestBG.jpg")}
        resizeMode="cover"
        style={styles.image}
      />
      <Text>Rejestracja</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegisterScreen;
