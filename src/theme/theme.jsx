export const palette = {
  white: "#ffffff",
  black: "#000000",

  gray: "#6b7280",
  lightGray: "#e5e7eb",

  blue: "#3b82f6",
  green: "#22c55e",
  red: "#ef4444",
  purple: "#a855f7",
  orange: "#f97316",
};

export const createTheme = (primary = "blue") => {
  const main = palette[primary] || palette.blue;

  return {
    colors: {
      // главный цвет приложения
      primary: main,

      // текст
      text: palette.black,
      secondaryText: palette.gray,

      // фоны
      background: palette.white,
      backgroundSecondary: "#f9fafb",

      // границы
      border: palette.lightGray,

      // состояния
      success: palette.green,
      danger: palette.red,

      // 👇 ВАЖНО: цвета для аккаунтов
      blue: palette.blue,
      green: palette.green,
      purple: palette.purple,
      orange: palette.orange,
    },

    spacing: {
      sm: 8,
      md: 12,
      lg: 16,
    },

    sizes: {
      navbarHeight: 70,
    },
  };
};