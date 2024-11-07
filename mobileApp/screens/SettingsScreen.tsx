import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useSettingsContext } from "../context/settingsContext";

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useSettingsContext();
  const isDarkMode = theme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "#fff" },
      ]}
    >
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
});

export default SettingsScreen;
