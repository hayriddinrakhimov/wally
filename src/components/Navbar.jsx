import { Wallet, BarChart, Repeat, PiggyBank, Plus } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";

export const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenSheet,
}) => {
  const theme = useTheme();

  const primary = theme.colors.primary; // ✅ ВСЕГДА отсюда

  const items = [
    { id: "wallet", icon: Wallet },
    { id: "stats", icon: BarChart },
    { id: "subscriptions", icon: Repeat },
    { id: "deposit", icon: PiggyBank },
  ];

  const handlePress = (e, scale) => {
    e.currentTarget.style.transform = `scale(${scale})`;
  };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: theme.sizes.navbarHeight,

        paddingBottom: "env(safe-area-inset-bottom)",

        background: theme.colors.background,
        borderTop: `1px solid ${theme.colors.border}`,

        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {/* ЛЕВАЯ */}
      {items.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={navButton}
            onMouseDown={(e) => handlePress(e, 0.9)}
            onMouseUp={(e) => handlePress(e, 1)}
            onMouseLeave={(e) => handlePress(e, 1)}
          >
            <Icon
              size={20}
              color={isActive ? primary : theme.colors.secondaryText}
            />
          </button>
        );
      })}

      {/* ОТСТУП */}
      <div style={{ width: "64px" }} />

      {/* ПРАВАЯ */}
      {items.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={navButton}
            onMouseDown={(e) => handlePress(e, 0.9)}
            onMouseUp={(e) => handlePress(e, 1)}
            onMouseLeave={(e) => handlePress(e, 1)}
          >
            <Icon
              size={20}
              color={isActive ? primary : theme.colors.secondaryText}
            />
          </button>
        );
      })}

      {/* FAB */}
      <button
        onClick={() => onOpenSheet && onOpenSheet("add")}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "-28px",

          width: "56px",
          height: "56px",
          borderRadius: "50%",

          background: primary, // ✅ теперь работает всегда
          border: "none",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          cursor: "pointer",
          zIndex: 10,

          boxShadow: theme.shadow.md,
        }}
      >
        <Plus size={24} color="white" />
      </button>
    </nav>
  );
};

const navButton = {
  width: "48px",
  height: "48px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  background: "transparent",
  border: "none",
  cursor: "pointer",

  transition: "transform 0.1s ease",
};