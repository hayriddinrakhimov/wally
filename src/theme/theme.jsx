// theme/theme.jsx

// ===== 1. БАЗОВАЯ ПАЛИТРА =====
const palette = {
  white: "white",
  black: "black",

  gray: "gray",
  lightGray: "lightgray",

  blue: "blue",
  green: "green",
  red: "red",
  purple: "purple",
  orange: "orange",
};

// ===== 2. ФУНКЦИЯ ТЕМЫ =====
export const createTheme = (primary = "blue") => ({
  palette,

  colors: {
    primary,

    text: palette.black,
    secondaryText: palette.gray,

    background: palette.white,
    backgroundSecondary: palette.white,

    border: palette.lightGray,

    danger: palette.red,
    success: palette.green,
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },

  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
  },

  font: {
    title: "18px",
    subtitle: "13px",
    body: "15px",
  },

  sizes: {
    headerHeight: "64px",
    navbarHeight: "64px",

    buttonHeight: "44px",
    inputHeight: "44px",

    icon: "20px",
  },

  shadow: {
    sm: "0 2px 6px rgba(0,0,0,0.05)",
    md: "0 4px 12px rgba(0,0,0,0.08)",
  },
});

// ===== 3. ДЕФОЛТ =====
export const theme = createTheme();