import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useSettingsContext } from "../context/settingsContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../types/navigation.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Settings"
>;

type SettingsScreenProps = {
  navigation: SettingsScreenNavigationProp;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme, toggleTheme } = useSettingsContext();
  const isDarkMode = theme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "#fff" },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon
          name="arrow-back"
          size={30}
          color={isDarkMode ? "#fff" : "#000"}
        />
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
        Ustawienia
      </Text>
      <View style={styles.setting}>
        <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>Tryb ciemny</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    padding: 10,
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 15,
    zIndex: 1,
  },
});

export default SettingsScreen;
