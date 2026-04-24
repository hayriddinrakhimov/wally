import { Pencil } from "lucide-react";

export const AccountCard = ({ account, onEdit }) => {
  const gradients = {
    blue: "linear-gradient(135deg, #3b82f6, #1e293b)",
    green: "linear-gradient(135deg, #22c55e, #1e293b)",
    purple: "linear-gradient(135deg, #a855f7, #1e293b)",
    orange: "linear-gradient(135deg, #f97316, #1e293b)",
    red: "linear-gradient(135deg, #ef4444, #1e293b)",
    pink: "linear-gradient(135deg, #ec4899, #1e293b)",
    cyan: "linear-gradient(135deg, #06b6d4, #1e293b)",
    yellow: "linear-gradient(135deg, #eab308, #1e293b)",
    indigo: "linear-gradient(135deg, #6366f1, #1e293b)",
    teal: "linear-gradient(135deg, #14b8a6, #1e293b)",
  };

  const bg = gradients[account.color] || gradients.blue;

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1.6 / 1",
        borderRadius: 20,
        padding: 18,
        background: bg,
        color: "white",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* ✏️ КНОПКА РЕДАКТИРОВАНИЯ */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // 🔥 важно (чтобы не ломать swipe)
          onEdit(account);
        }}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 32,
          height: 32,
          borderRadius: 10,
          background: "rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
        }}
      >
        <Pencil size={16} />
      </div>

      {/* КОНТЕНТ */}
      <div>
        <div style={{ opacity: 0.85 }}>
          {account.name} • {account.currency}
        </div>

        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginTop: 10,
          }}
        >
          {account.balance} {getCurrencySymbol(account.currency)}
        </div>
      </div>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        {account.type === "card"
          ? "**** 1234"
          : account.type === "deposit"
          ? "Депозит"
          : "Наличные"}
      </div>
    </div>
  );
};

function getCurrencySymbol(currency) {
  switch (currency) {
    case "USD":
      return "$";
    case "RUB":
      return "₽";
    default:
      return "₸";
  }
}