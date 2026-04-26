import { Wallet, BarChart3, Plus, Repeat, PiggyBank } from "lucide-react";
import { useTheme } from "../theme/useTheme";

export const Navbar = ({ activeTab, setActiveTab, onOpenSheet }) => {
  const theme = useTheme() || {};

  const colors = theme.colors || {};
  const sizes = theme.sizes || {};

  const primary = colors.primary || "#3b82f6";
  const secondaryText = colors.secondaryText || "#6b7280";
  const border = colors.border || "#e5e7eb";
  const background = colors.background || "#ffffff";

  const navHeight = Math.max(Number(sizes.navbarHeight) || 70, 78);

  const items = [
    { key: "wallet", icon: Wallet, label: "Кошелек" },
    { key: "analytics", icon: BarChart3, label: "Аналитика" },
    { key: "subscriptions", icon: Repeat, label: "Подписки" },
    { key: "deposit", icon: PiggyBank, label: "Цели" },
  ];

  const renderTab = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.key;

    return (
      <button
        key={item.key}
        type="button"
        title={item.label}
        onClick={() => setActiveTab(item.key)}
        style={{
          height: 52,
          border: "none",
          background: "transparent",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isActive ? primary : secondaryText,
          position: "relative",
          padding: 0,
        }}
      >
        {isActive && (
          <span
            style={{
              position: "absolute",
              top: 4,
              width: 22,
              height: 3,
              borderRadius: 999,
              background: primary,
            }}
          />
        )}

        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 9,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: isActive ? "rgba(59, 130, 246, 0.12)" : "transparent",
          }}
        >
          <Icon size={18} />
        </span>
      </button>
    );
  };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: navHeight,
        background,
        borderTop: `1px solid ${border}`,
        padding: "6px 10px calc(8px + env(safe-area-inset-bottom, 0px))",
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto 1fr 1fr",
          alignItems: "end",
          gap: 2,
        }}
      >
        {items.slice(0, 2).map(renderTab)}

        <div
          style={{
            marginTop: -24,
          }}
        >
          <button
            type="button"
            onClick={() => onOpenSheet("add")}
            title="Добавить операцию"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "none",
              background: primary,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 24px rgba(37, 99, 235, 0.35)",
            }}
          >
            <Plus size={24} color="#fff" />
          </button>
        </div>

        {items.slice(2).map(renderTab)}
      </div>
    </nav>
  );
};
