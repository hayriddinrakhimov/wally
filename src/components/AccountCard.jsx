const gradients = {
  blue: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
  green: "linear-gradient(135deg, #22c55e 0%, #14532d 100%)",
  purple: "linear-gradient(135deg, #a855f7 0%, #581c87 100%)",
  orange: "linear-gradient(135deg, #f97316 0%, #7c2d12 100%)",
  red: "linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)",
};

export const AccountCard = ({ account, isActive }) => {
  const gradient =
    gradients[account.color] || gradients.blue;

  return (
    <div
      style={{
        height: 160,
        borderRadius: 20,
        padding: 18,

        background: gradient,
        color: "white",

        boxShadow: "none",

        transform: isActive ? "scale(1)" : "scale(0.96)",
        transition: "all 0.25s ease",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* ===== ВЕРХ ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ opacity: 0.85 }}>
          {account.name || "Счет"}
        </div>

        <div
          style={{
            fontSize: 14,
            opacity: 0.8,
          }}
        >
          {account.currency || "₸"}
        </div>
      </div>

      {/* ===== БАЛАНС ===== */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        {account.balance ?? 0}{" "}
        <span
          style={{
            fontSize: 16,
            opacity: 0.85,
          }}
        >
          {account.currency || "₸"}
        </span>
      </div>

      {/* ===== НИЗ ===== */}
      <div
        style={{
          fontSize: 12,
          opacity: 0.7,
        }}
      >
        **** 1234
      </div>
    </div>
  );
};