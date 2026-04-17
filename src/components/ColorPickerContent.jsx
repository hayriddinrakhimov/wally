import { useTheme } from "../theme/ThemeProvider";

const COLORS = [
  "blue",
  "royalblue",
  "deepskyblue",
  "green",
  "limegreen",
  "seagreen",
  "red",
  "crimson",
  "tomato",
  "purple",
  "indigo",
  "violet",
  "orange",
  "darkorange",
  "gold",
  "black",
  "gray",
  "brown",
];

export const ColorPickerContent = ({ primary, setPrimary }) => {
  const theme = useTheme();

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          justifyItems: "center",
          gap: theme.spacing.md,
        }}
      >
        {COLORS.map((color) => {
          const isActive = primary === color;

          return (
            <button
              key={color}
              onClick={() => setPrimary(color)}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: color,

                border: isActive
                  ? `3px solid ${theme.colors.text}`
                  : `2px solid ${theme.colors.border}`,

                cursor: "pointer",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                transform: isActive ? "scale(1.1)" : "scale(1)",
                transition: "all 0.15s ease",
              }}
            >
              {isActive && (
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background:
                      color === "white" ? "black" : "white",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};