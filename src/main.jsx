import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./theme/ThemeProvider";

const Root = () => {
  // 👉 храним primary ГЛОБАЛЬНО
  const [primary, setPrimary] = useState(() => {
    return localStorage.getItem("primary") || "blue";
  });

  useEffect(() => {
    localStorage.setItem("primary", primary);
  }, [primary]);

  return (
    <ThemeProvider primary={primary}>
      <App setPrimary={setPrimary} />
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);