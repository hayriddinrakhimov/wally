import { palette } from "../theme/theme";

export const ColorPickerContent = ({
  value,
  onChange,
  title = "Выбор цвета",
}) => {
  const colors = ["blue", "green", "purple", "orange", "red"];

  return (
    <div
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* 🔥 ЗАГОЛОВОК */}
      <div style={{ fontWeight: 600 }}>{title}</div>

      {/* 🔥 ЦВЕТА */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {colors.map((color) => {
          const isActive = value === color;

          return (
            <div
              key={color}
              onClick={() => onChange(color)} // ✅ теперь работает
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: palette[color],
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: isActive
                  ? "3px solid black"
                  : "2px solid #e5e7eb",
              }}
            >
              {isActive && (
                <span style={{ color: "white", fontSize: 18 }}>
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};