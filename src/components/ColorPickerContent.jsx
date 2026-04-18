import { palette } from "../theme/theme";

export const ColorPickerContent = ({ primary, setPrimary }) => {
  const colors = [
    "blue",
    "green",
    "purple",
    "orange",
    "red",
  ];

  return (
    <div
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ fontWeight: 600 }}>
        Основной цвет приложения
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {colors.map((color) => {
          const isActive = primary === palette[color];

          return (
            <div
              key={color}
              onClick={() => setPrimary(color)}
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