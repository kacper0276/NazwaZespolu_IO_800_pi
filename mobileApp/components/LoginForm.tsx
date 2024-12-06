import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { ILogin } from "../types/auth.interface";

interface LoginFormProps {
  onLogin: (authData: ILogin) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [authData, setAuthData] = useState<ILogin>({ email: "", password: "" });

  const handleLogin = () => {
    onLogin(authData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={authData.email}
        onChangeText={(email) => {
          setAuthData({ ...authData, email });
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={authData.password}
        onChangeText={(password) => {
          setAuthData({ ...authData, password });
        }}
        secureTextEntry
      />
      <Button title="Log in" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    width: 260,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LoginForm;
