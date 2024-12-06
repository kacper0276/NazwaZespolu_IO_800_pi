import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { IRegister } from "../types/auth.interface";

interface RegisterFormProps {
  onRegister: (registerData: IRegister) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [registerData, setRegisterData] = useState<IRegister>({
    email: "",
    password: "",
    repeatPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleRegister = () => {
    onRegister(registerData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={registerData.email}
        onChangeText={(email) => {
          setRegisterData({ ...registerData, email });
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={registerData.password}
        onChangeText={(password) => {
          setRegisterData({ ...registerData, password });
        }}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat password"
        value={registerData.repeatPassword}
        onChangeText={(repeatPassword) => {
          setRegisterData({ ...registerData, repeatPassword });
        }}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Firstname"
        value={registerData.firstName}
        onChangeText={(firstName) => {
          setRegisterData({ ...registerData, firstName });
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Lastname"
        value={registerData.lastName}
        onChangeText={(lastName) => {
          setRegisterData({ ...registerData, lastName });
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Register in" onPress={handleRegister} />
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

export default RegisterForm;
