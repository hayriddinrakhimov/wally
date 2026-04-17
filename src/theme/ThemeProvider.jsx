import { createContext, useContext } from "react";
import { createTheme } from "./theme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ primary, children }) => {
  const theme = createTheme(primary);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};