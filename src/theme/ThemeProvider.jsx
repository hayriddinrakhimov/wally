import { createContext, useContext, useState } from "react";
import { createTheme } from "./createTheme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [primary, setPrimary] = useState("blue");

  const theme = createTheme(primary);

  // защита от undefined theme
  if (!theme || !theme.colors) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setPrimary }}>
      <div
        style={{
          "--primary": theme.colors.primary || "#3b82f6",
          "--bg": theme.colors.background || "#ffffff",
          "--text": theme.colors.text || "#111111",
          "--text-secondary":
            theme.colors.secondaryText || "#6b7280",
          "--border": theme.colors.border || "#e5e7eb",
          "--danger": theme.colors.danger || "#ef4444",

          background: "var(--bg)",
          color: "var(--text)",

          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

/* ===================== HOOKS ===================== */

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used within ThemeProvider"
    );
  }

  return context.theme;
};

export const useSetPrimary = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useSetPrimary must be used within ThemeProvider"
    );
  }

  return context.setPrimary;
};