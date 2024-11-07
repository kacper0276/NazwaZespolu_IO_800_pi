import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../types/navigation.types";
import { COLORS } from "../const/index";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Witam na ekranie głównym!</Text>
      <Text style={styles.link} onPress={() => navigation.navigate("Details")}>
        Idź do szczegółów
      </Text>
      <Button
        title="Ustawienia"
        onPress={() => navigation.navigate("Settings")}
      />
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
