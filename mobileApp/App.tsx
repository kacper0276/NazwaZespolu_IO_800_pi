import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation.types";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import { ScreenRotateProvider } from "./context/screenRotateContext";
import { AuthProvider, useAuthContext } from "./context/authContext";
import LoginScreen from "./screens/LoginScreen";

export const API_URL = "http://localhost:3001";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { logged } = useAuthContext();

  return (
    <Stack.Navigator
      initialRouteName={logged ? "Home" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      {!logged ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Logowanie" }}
        />
      ) : (
        <>
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
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <ScreenRotateProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ScreenRotateProvider>
  );
}
