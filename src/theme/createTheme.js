export const createTheme = (primary = "blue") => {
  const colorsMap = {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    green: "#22c55e",
    red: "#ef4444",
  };

  const main = colorsMap[primary] || primary;

  return {
    colors: {
      primary: main,
      background: "#ffffff",
      text: "#111827",
      secondaryText: "#6b7280",
      border: "#e5e7eb",
      danger: "#ef4444",
    },

    spacing: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },

    radius: {
      sm: 8,
      md: 12,
      lg: 20,
    },

    // 👇 КЛЮЧЕВОЕ
    font: {
      subtitle: 12,
      body: 14,
      title: 16,
    },
  };
};