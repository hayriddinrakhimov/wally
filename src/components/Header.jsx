import { Bell, Settings, Wallet } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";

export const Header = ({ onOpenSheet, hasUnread }) => {
  const theme = useTheme() || {};
  const colors = theme.colors || {};
  const spacing = theme.spacing || {};

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `${spacing.md || 12}px ${spacing.lg || 16}px`,
        borderBottom: `1px solid ${colors.border || "#e5e7eb"}`,
        background: colors.background || "#fff",
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* LOGO */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${
              colors.primary || "#3b82f6"
            }, #000)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Wallet size={18} color="#fff" />
        </div>

        {/* TEXT */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: 16,
              color: colors.text || "#000",
              lineHeight: 1,
            }}
          >
            Wally
          </span>

          <span
            style={{
              fontSize: 12,
              color: colors.secondaryText || "#6b7280",
              marginTop: 2,
            }}
          >
            Ваш личный кошелек
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* NOTIFICATIONS */}
        <div
          onClick={() => onOpenSheet("notifications")}
          style={{
            position: "relative",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Bell size={20} color={colors.text || "#000"} />

          {hasUnread && (
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: colors.primary || "#3b82f6",
              }}
            />
          )}
        </div>

        {/* SETTINGS */}
        <div
          onClick={() => onOpenSheet("settings")}
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Settings size={20} color={colors.text || "#000"} />
        </div>
      </div>
    </header>
  );
};