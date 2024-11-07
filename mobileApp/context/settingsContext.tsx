import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark";

interface ISettingsContextType {
  theme: Theme;
  toggleTheme: () => void;
  // * Add other settings
}

type Props = {
  children?: React.ReactNode;
};

const SettingsContext = createContext<ISettingsContextType>({
  theme: "light",
  toggleTheme: () => {},
});

const SettingsProvider: React.FC<Props> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(
    systemTheme === "dark" ? "dark" : "light"
  );

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    setTheme(systemTheme === "dark" ? "dark" : "light");
  }, [systemTheme]);

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettingsContext = () => useContext(SettingsContext);

export { SettingsProvider, useSettingsContext };
