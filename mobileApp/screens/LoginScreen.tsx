import React from "react";
import { useAuthContext } from "../context/authContext";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LoginForm from "../components/LoginForm";
import { RootStackParamList } from "../types/navigation.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ILogin } from "../types/auth.interface";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuthContext();

  const handleLogin = (authData: ILogin) => {
    console.log(authData);
    if (authData.email && authData.password) {
      const userData = { id: 1, name: "test test", email: authData.email };
      // TODO: Create request to backend
      login(userData);
    } else {
      Alert.alert("Error", "Please enter both email and password");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/ForestBG.jpg")}
        resizeMode="cover"
        style={styles.image}
      />
      <Text style={styles.title}>Log in</Text>
      <LoginForm onLogin={handleLogin} />

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    color: "#fff",
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
  link: {},
  linkText: {},
});
