import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { IRegister } from "../types/auth.interface";
import RegisterForm from "../components/RegisterForm";

const RegisterScreen: React.FC = () => {
  const handleRegister = (registerData: IRegister) => {
    console.log(registerData);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/ForestBG.jpg")}
        resizeMode="cover"
        style={styles.image}
      />
      <Text style={styles.title}>Register in</Text>
      <RegisterForm onRegister={handleRegister} />
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#000",
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
