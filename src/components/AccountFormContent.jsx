import { useCallback, useEffect } from "react";
import { useTheme } from "../theme/useTheme";

export const AccountFormContent = ({
  account,
  color,
  onOpenColorPicker,
  onSave,
  onChange,
}) => {
  const theme = useTheme();

  const name = account?.name || "";
  const currency = account?.currency || "KZT";
  const type = account?.type || "card";

  const handleSubmit = useCallback(() => {
    if (!name.trim()) return;

    onSave({
      ...account,
      name: name.trim(),
      color,
    });
  }, [name, onSave, account, color]);

  useEffect(() => {
    const handler = () => handleSubmit();

    document.addEventListener("submitAccount", handler);
    return () => {
      document.removeEventListener("submitAccount", handler);
    };
  }, [handleSubmit]);

  return (
    <div>
      <div style={{ padding: 16 }}>
        <PreviewCard
          name={name || "Название счета"}
          currency={currency}
          color={color}
          type={type}
        />

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
          }}
        >
          {[
            { id: "cash", label: "??" },
            { id: "card", label: "??" },
            { id: "deposit", label: "??" },
          ].map((accountType) => {
            const active = type === accountType.id;

            return (
              <div
                key={accountType.id}
                onClick={() => onChange({ ...account, type: accountType.id })}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  background: active ? "var(--primary)" : "transparent",
                  color: active ? "white" : "#888",
                  border: active ? "none" : `1px solid ${theme.colors.border}`,
                  cursor: "pointer",
                }}
              >
                {accountType.label}
              </div>
            );
          })}
        </div>
      </div>

      <SectionTitle>Счет</SectionTitle>

      <Block>
        <div style={{ padding: 16 }}>
          <input
            value={name}
            onChange={(event) =>
              onChange({
                ...account,
                name: event.target.value,
              })
            }
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

      <SectionTitle>Валюта</SectionTitle>

      <Block>
        <Row
          title="Валюта"
          right={
            <select
              value={currency}
              onChange={(event) =>
                onChange({
                  ...account,
                  currency: event.target.value,
                })
              }
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

const gradients = {
  blue: "linear-gradient(135deg, #3b82f6, #1e293b)",
  green: "linear-gradient(135deg, #22c55e, #1e293b)",
  purple: "linear-gradient(135deg, #a855f7, #1e293b)",
  orange: "linear-gradient(135deg, #f97316, #1e293b)",
  red: "linear-gradient(135deg, #ef4444, #1e293b)",
  pink: "linear-gradient(135deg, #ec4899, #1e293b)",
  cyan: "linear-gradient(135deg, #06b6d4, #1e293b)",
  yellow: "linear-gradient(135deg, #eab308, #1e293b)",
  indigo: "linear-gradient(135deg, #6366f1, #1e293b)",
  teal: "linear-gradient(135deg, #14b8a6, #1e293b)",
};

const PreviewCard = ({ name, currency, color, type }) => {
  const bg = gradients[color] || gradients.blue;

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1.6 / 1",
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
        {type === "card"
          ? "**** 1234"
          : type === "deposit"
            ? "Ставка 10%"
            : "Наличные"}
      </div>
    </div>
  );
};

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
      <div style={{ color: theme.colors.text, fontWeight: 500 }}>{title}</div>
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

function getCurrencySymbol(currency) {
  switch (currency) {
    case "USD":
      return "$";
    case "RUB":
      return "?";
    default:
      return "?";
  }
}

function getColorPreview(color) {
  const map = {
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

  return map[color] || map.blue;
}