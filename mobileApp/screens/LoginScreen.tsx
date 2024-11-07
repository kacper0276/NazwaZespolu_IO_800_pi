import React from "react";
import { useAuthContext } from "../context/authContext";
import { Alert, StyleSheet, Text, View } from "react-native";
import LoginForm from "../components/LoginForm";

const LoginScreen: React.FC = () => {
  const { login } = useAuthContext();

  const handleLogin = (email: string, password: string) => {
    if (email && password) {
      const userData = { id: 1, name: "test test", email };
      // TODO: Create request to backend
      login(userData);
    } else {
      Alert.alert("Error", "Please enter both email and password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>
      <LoginForm onLogin={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default LoginScreen;
