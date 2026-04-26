import { Bell, Settings, Wallet } from "lucide-react";
import { useTheme } from "../theme/useTheme";

export const Header = ({
  onOpenSettings,
  onOpenNotifications,
  hasUnread,
  disabled,
}) => {
  const theme = useTheme() || {};

  const colors = theme.colors || {};
  const spacing = theme.spacing || {};
  const sizes = theme.sizes || {};

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: sizes.headerHeight || 70,
        padding: `0 ${spacing.lg || 16}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${colors.border || "#e5e7eb"}`,
        background: colors.background || "#fff",
        transition: "opacity 0.2s ease",
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${colors.primary || "#3b82f6"}, #000)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Wallet size={18} color="#fff" />
        </div>

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

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          onClick={onOpenNotifications}
          style={{
            position: "relative",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
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

        <div
          onClick={onOpenSettings}
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <Settings size={20} color={colors.text || "#000"} />
        </div>
      </div>
    </header>
  );
};