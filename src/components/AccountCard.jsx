export const AccountCard = ({ account, isActive }) => {
  return (
    <div
      style={{
        height: 160,
        borderRadius: 20,
        padding: 18,

        background:
          "linear-gradient(135deg, #3b82f6 0%, #1e293b 100%)",

        color: "white",

        // ❌ убрали тени полностью
        boxShadow: "none",

        // 👇 чуть живости
        transform: isActive ? "scale(1)" : "scale(0.96)",
        transition: "all 0.25s ease",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ opacity: 0.85 }}>{account.name}</div>

        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginTop: 10,
          }}
        >
          {account.balance} ₸
        </div>
      </div>

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