import { useTheme } from "../theme/ThemeProvider";

export const AccountCard = ({ account }) => {
  const theme = useTheme() || {};
  const colors = theme.colors || {};

  const color =
    account.color === "primary"
      ? colors.primary
      : colors[account.color] || colors.primary;

  return (
    <div
      style={{
        height: 180,
        borderRadius: 20,
        padding: 16,
        color: "white",
        background: `linear-gradient(135deg, ${color}, #1a1a1a)`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 22 }}>{account.emoji}</span>
        <span style={{ opacity: 0.7 }}>{account.type}</span>
      </div>

      <div style={{ marginTop: 40 }}>
        <div style={{ fontSize: 16 }}>{account.name}</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          {account.balance} ₸
        </div>
      </div>
    </div>
  );
};