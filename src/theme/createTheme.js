export const createTheme = (primary = "blue") => {
  const colorsMap = {
    blue: "#3b82f6",
    green: "#22c55e",
    purple: "#a855f7",
    orange: "#f97316",
    red: "#ef4444",
    pink: "#ec4899",
    cyan: "#06b6d4",
    yellow: "#eab308",
    indigo: "#6366f1",
    teal: "#14b8a6",
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
