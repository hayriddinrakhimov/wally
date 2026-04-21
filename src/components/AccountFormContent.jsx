import { useState, useEffect } from "react";
import { useTheme } from "../theme/ThemeProvider";

export const AccountFormContent = ({
  account,
  color,
  onOpenColorPicker,
  onSave,
}) => {
  const theme = useTheme();

  const [name, setName] = useState(account?.name || "");
  const [currency, setCurrency] = useState(
    account?.currency || "KZT"
  );

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (typeof onSave !== "function") {
      console.warn("onSave не передан");
      return;
    }

    onSave({
      name,
      currency,
    });
  };

  // 💥 СЛУШАЕМ кнопку снизу (footer)
  useEffect(() => {
    const handler = () => handleSubmit();

    document.addEventListener("submitAccount", handler);

    return () =>
      document.removeEventListener("submitAccount", handler);
  }, [name, currency, onSave]);

  /* ================= UI ================= */

  return (
    <div>
      {/* ===== ПРЕВЬЮ ===== */}
      <div style={{ padding: 16 }}>
        <PreviewCard
          name={name || "Название счета"}
          currency={currency}
          color={color}
        />
      </div>

      {/* ===== НАЗВАНИЕ ===== */}
      <SectionTitle>Счет</SectionTitle>

      <Block>
        <div style={{ padding: 16 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название счета"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: 16,
              color: theme.colors.text,
              background: "transparent",
            }}
          />
        </div>
      </Block>

      {/* ===== ВАЛЮТА ===== */}
      <SectionTitle>Валюта</SectionTitle>

      <Block>
        <Row
          title="Валюта"
          right={
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: 16,
                color: theme.colors.text,
              }}
            >
              <option value="KZT">KZT</option>
              <option value="USD">USD</option>
              <option value="RUB">RUB</option>
            </select>
          }
        />
      </Block>

      {/* ===== ЦВЕТ ===== */}
      <SectionTitle>Цвет</SectionTitle>

      <Block>
        <Row
          title="Цвет счета"
          right={<ColorDot color={getColorPreview(color)} />}
          onClick={onOpenColorPicker}
        />
      </Block>
    </div>
  );
};

/* ================= ПРЕВЬЮ ================= */

const gradients = {
  blue: "linear-gradient(135deg, #3b82f6, #1e293b)",
  green: "linear-gradient(135deg, #22c55e, #1e293b)",
  purple: "linear-gradient(135deg, #a855f7, #1e293b)",
  orange: "linear-gradient(135deg, #f97316, #1e293b)",
  red: "linear-gradient(135deg, #ef4444, #1e293b)",
};

const PreviewCard = ({ name, currency, color }) => {
  const bg = gradients[color] || gradients.blue;

  return (
    <div
      style={{
        height: 160,
        borderRadius: 20,
        padding: 18,
        background: bg,
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ opacity: 0.85 }}>
          {name} • {currency}
        </div>

        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginTop: 10,
          }}
        >
          0 {getCurrencySymbol(currency)}
        </div>
      </div>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        **** 1234
      </div>
    </div>
  );
};

/* ================= UI ================= */

const SectionTitle = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        fontSize: 12,
        color: theme.colors.secondaryText,
        margin: "16px 0 6px",
      }}
    >
      {children}
    </div>
  );
};

const Block = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {children}
    </div>
  );
};

const Row = ({ title, right, onClick }) => {
  const theme = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 16,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{ color: theme.colors.text, fontWeight: 500 }}>
        {title}
      </div>
      {right}
    </div>
  );
};

const ColorDot = ({ color }) => (
  <div
    style={{
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: color,
    }}
  />
);

/* ================= HELPERS ================= */

function getCurrencySymbol(currency) {
  switch (currency) {
    case "USD":
      return "$";
    case "RUB":
      return "₽";
    default:
      return "₸";
  }
}

function getColorPreview(color) {
  const map = {
    blue: "#3b82f6",
    green: "#22c55e",
    purple: "#a855f7",
    orange: "#f97316",
    red: "#ef4444",
  };

  return map[color] || map.blue;
}