import { createContext, useContext, useState } from "react";
import { createTheme } from "./createTheme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [primary, setPrimary] = useState("blue");

  const theme = createTheme(primary);

  return (
    <ThemeContext.Provider value={{ theme, setPrimary }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context.theme;
};

export const useSetPrimary = () => {
  const context = useContext(ThemeContext);
  return context.setPrimary;
};