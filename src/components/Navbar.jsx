import { Wallet, BarChart3, Plus, Repeat, PiggyBank } from "lucide-react";
import { useTheme } from "../theme/useTheme";

export const Navbar = ({ activeTab, setActiveTab, onOpenSheet }) => {
  const theme = useTheme() || {};

  const spacing = theme.spacing || {};
  const colors = theme.colors || {};
  const sizes = theme.sizes || {};

  const items = [
    { key: "wallet", icon: Wallet, title: "Главная" },
    { key: "analytics", icon: BarChart3, title: "Аналитика" },
    { key: "subscriptions", icon: Repeat, title: "Подписки" },
    { key: "deposit", icon: PiggyBank, title: "Депозит" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: sizes.navbarHeight || 70,
        background: colors.background || "#fff",
        borderTop: `1px solid ${colors.border || "#e5e7eb"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: spacing.md || 12,
        zIndex: 100,
      }}
    >
      {items.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.key;

        return (
          <div
            key={item.key}
            title={item.title}
            onClick={() => setActiveTab(item.key)}
            style={{
              cursor: "pointer",
              color: isActive
                ? colors.primary || "#3b82f6"
                : colors.secondaryText || "#6b7280",
            }}
          >
            <Icon size={22} />
          </div>
        );
      })}

      <div
        onClick={() => onOpenSheet("add")}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: colors.primary || "#3b82f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -30,
          cursor: "pointer",
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        }}
        title="Добавить операцию"
      >
        <Plus size={24} color="#fff" />
      </div>

      {items.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.key;

        return (
          <div
            key={item.key}
            title={item.title}
            onClick={() => setActiveTab(item.key)}
            style={{
              cursor: "pointer",
              color: isActive
                ? colors.primary || "#3b82f6"
                : colors.secondaryText || "#6b7280",
            }}
          >
            <Icon size={22} />
          </div>
        );
      })}
    </nav>
  );
};
