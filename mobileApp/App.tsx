import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation.types";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import { ScreenRotateProvider } from "./context/screenRotateContext";

export const API_URL = "http://localhost:3001";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ScreenRotateProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Strona Główna" }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{ title: "Szczegóły" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ScreenRotateProvider>
  );
}
