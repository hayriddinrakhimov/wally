import { getCategory } from "../utils/getCategory";
import { getTransactionColor } from "../utils/getTransactionColor";
import { formatMoney } from "../utils/formatMoney";

export const TransactionsList = ({
  transactions = [],
  accounts = [],
  onPress,
}) => {
  if (!transactions.length) {
    return (
      <div
        style={{
          padding: 16,
          textAlign: "center",
          color: "var(--text-secondary)",
          fontSize: 14,
        }}
      >
        Нет операций
      </div>
    );
  }

  const getAccountName = (id) =>
    accounts.find((a) => a.id === id)?.name || "—";

  const getTypeLabel = (type) => {
    switch (type) {
      case "income":
        return "Доход";
      case "expense":
        return "Расход";
      case "transfer":
        return "Перевод";
      default:
        return "Операция";
    }
  };

  return (
    <div style={{ padding: "0 12px", marginTop: 12 }}>
      {transactions.map((tx) => {
        const category = getCategory(tx.categoryId);
        const isTransfer = tx.type === "transfer";

        const typeLabel = getTypeLabel(tx.type);

        const title = isTransfer
          ? "Перевод"
          : `${typeLabel}: ${category?.name || "Без категории"}`;

        return (
          <div
            key={tx.id}
            onClick={() => onPress?.(tx)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              marginBottom: 10,
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* TITLE */}
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                {title}
              </div>

              {/* ACCOUNTS */}
              <div
                style={{
                  fontSize: 12,
                  marginTop: 3,
                  color: "var(--text-secondary)",
                }}
              >
                {isTransfer
                  ? `${getAccountName(tx.from)} → ${getAccountName(
                      tx.to
                    )}`
                  : getAccountName(tx.from || tx.to)}
              </div>

              {/* NOTE */}
              {tx.note && (
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 3,
                    color: "var(--text-secondary)",
                  }}
                >
                  {tx.note}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontWeight: 700,
                  color: getTransactionColor(tx.type),
                }}
              >
                {tx.type === "income" && "+"}
                {tx.type === "expense" && "-"}
                {tx.type === "transfer" && "↔"}{" "}
                {formatMoney(tx.amount, tx.currency || "KZT")}
              </div>

              <div
                style={{
                  fontSize: 12,
                  marginTop: 3,
                  color: "var(--text-secondary)",
                }}
              >
                {new Date(tx.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};