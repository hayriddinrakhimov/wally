import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context.theme;
};

export const useSetPrimary = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useSetPrimary must be used within ThemeProvider");
  }

  return context.setPrimary;
};