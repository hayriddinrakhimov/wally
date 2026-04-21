import { createContext, useContext, useState } from "react";
import { createTheme } from "./createTheme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [primary, setPrimary] = useState("blue");

  const theme = createTheme(primary);

  return (
    <ThemeContext.Provider value={{ theme, setPrimary }}>
      <div
        style={{
          "--primary": theme.colors.primary,
          "--bg": theme.colors.background,        // ✅ ВОТ ФИКС
          "--text": theme.colors.text,
          "--text-secondary": theme.colors.secondaryText,
          "--border": theme.colors.border,
          "--danger": theme.colors.danger,
        }}
      >
        {children}
      </div>
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