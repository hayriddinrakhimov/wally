import { useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { createTheme } from "./createTheme";

export const ThemeProvider = ({ children }) => {
  const [primary, setPrimary] = useState("#3b82f6");
  const theme = useMemo(() => createTheme(primary), [primary]);

  return (
    <ThemeContext.Provider value={{ theme, setPrimary }}>
      <div
        style={{
          "--primary": theme.colors.primary || "#3b82f6",
          "--bg": theme.colors.background || "#ffffff",
          "--bg-secondary":
            theme.colors.backgroundSecondary || "#f9fafb",
          "--text": theme.colors.text || "#111111",
          "--text-secondary":
            theme.colors.secondaryText || "#6b7280",
          "--border": theme.colors.border || "#e5e7eb",
          "--danger": theme.colors.danger || "#ef4444",
          "--font-main":
            "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "var(--bg)",
          color: "var(--text)",
          fontFamily: "var(--font-main)",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
