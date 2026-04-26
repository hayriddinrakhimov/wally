import { normalizeColor, toCardGradient } from "../utils/colors";

export const AccountColorPickerContent = ({ value, onChange }) => {
  const safeColor = normalizeColor(value, "#3b82f6");

  return (
    <div
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ fontWeight: 600 }}>Цвет счета</div>

      <div
        style={{
          width: "100%",
          height: 80,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.25)",
          background: toCardGradient(safeColor),
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <input
          type="color"
          value={safeColor}
          onChange={(event) => onChange(normalizeColor(event.target.value, safeColor))}
          title="Выбрать цвет счета"
          aria-label="Выбрать цвет счета"
          style={{
            width: 56,
            height: 56,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        />

        <div
          style={{
            height: 38,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg)",
            padding: "0 12px",
            display: "inline-flex",
            alignItems: "center",
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: 0.2,
          }}
        >
          {safeColor.toUpperCase()}
        </div>
      </div>
    </div>
  );
};
