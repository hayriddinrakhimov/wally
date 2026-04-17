import { Bell, Settings, Wallet } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";
import { IconButton } from "./IconButton";

// ===== ТИТУЛЫ =====
const titles = {
  wallet: {
    title: "Wally",
    subtitle: "Ваш личный кошелек",
  },
  stats: {
    title: "Аналитика",
    subtitle: "Статистика финансов",
  },
  subscriptions: {
    title: "Подписки",
    subtitle: "Регулярные платежи",
  },
  deposit: {
    title: "Депозит",
    subtitle: "Ваши накопления",
  },
};

export const Header = ({
  activeTab,
  onOpenSheet,
  hasUnread,
}) => {
  const theme = useTheme(); // ✅ только внутри

  const current = titles[activeTab] || titles.wallet;

  return (
    <header
      style={{
        height: theme.sizes.headerHeight,
        paddingTop: "env(safe-area-inset-top)",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        paddingLeft: theme.spacing.lg,
        paddingRight: theme.spacing.lg,

        borderBottom: `1px solid ${theme.colors.border}`,
        background: theme.colors.background,
      }}
    >
      {/* ===== ЛЕВАЯ ЧАСТЬ ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.md,
        }}
      >
        {/* ЛОГО */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: theme.radius.md,
            background: theme.colors.primary,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Wallet size={20} color="white" />
        </div>

        {/* ТЕКСТ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            lineHeight: "1.2",
          }}
        >
          <span
            style={{
              fontSize: theme.font.title,
              fontWeight: "600",
              color: theme.colors.text,
            }}
          >
            {current.title}
          </span>

          <span
            style={{
              fontSize: theme.font.subtitle,
              color: theme.colors.secondaryText,
            }}
          >
            {current.subtitle}
          </span>
        </div>
      </div>

      {/* ===== ПРАВАЯ ЧАСТЬ ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        {/* УВЕДОМЛЕНИЯ */}
        <IconButton onClick={() => onOpenSheet("notifications")}>
          <div style={iconWrap}>
            <Bell size={20} color={theme.colors.text} />

            {hasUnread && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: theme.colors.primary,
                }}
              />
            )}
          </div>
        </IconButton>

        {/* НАСТРОЙКИ */}
        <IconButton onClick={() => onOpenSheet("settings")}>
          <div style={iconWrap}>
            <Settings size={20} color={theme.colors.text} />
          </div>
        </IconButton>
      </div>
    </header>
  );
};

// ===== ОБЩИЙ КОНТЕЙНЕР ДЛЯ ИКОНОК =====
const iconWrap = {
  position: "relative",
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};