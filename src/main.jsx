import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ThemeProvider } from "./theme/ThemeProvider";
import { CurrencyProvider } from "./context/CurrencyProvider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CurrencyProvider baseCurrency="KZT">
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </CurrencyProvider>
  </React.StrictMode>
);