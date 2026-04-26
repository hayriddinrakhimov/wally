import { useTheme } from "../theme/useTheme";

export const IconButton = ({
  children,
  onClick,
  size = "md",
  disabled = false,
}) => {
  const theme = useTheme();

  const sizes = {
    sm: "32px",
    md: "40px",
    lg: "48px",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: sizes[size],
        height: sizes[size],

        borderRadius: theme.radius.md,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: "transparent",
        border: "none",

        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,

        transition: "transform 0.1s ease, background 0.15s ease",
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "scale(0.95)";
        }
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background =
            theme.colors.backgroundSecondary;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
};