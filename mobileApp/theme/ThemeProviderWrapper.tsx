import React from "react";
import { ThemeProvider } from "styled-components/native";
import { lightTheme, darkTheme } from "../const";
import { useSettingsContext } from "../context/settingsContext";

type Props = {
  children?: React.ReactNode;
};

const ThemeProviderWrapper: React.FC<Props> = ({ children }) => {
  const { theme } = useSettingsContext();

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviderWrapper;
