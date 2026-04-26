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
    accounts.find((account) => account.id === id)?.name || "—";

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
      {transactions.map((transaction) => {
        const from = transaction.from || transaction.fromAccountId;
        const to = transaction.to || transaction.toAccountId;
        const categoryId =
          transaction.categoryId || transaction.category || null;

        const category = getCategory(categoryId);
        const isTransfer = transaction.type === "transfer";

        const typeLabel = getTypeLabel(transaction.type);

        const title = isTransfer
          ? "Перевод"
          : `${typeLabel}: ${category?.name || "Без категории"}`;

        return (
          <div
            key={transaction.id}
            onClick={() => onPress?.(transaction)}
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                {title}
              </div>

              <div
                style={{
                  fontSize: 12,
                  marginTop: 3,
                  color: "var(--text-secondary)",
                }}
              >
                {isTransfer
                  ? `${getAccountName(from)} > ${getAccountName(to)}`
                  : getAccountName(from || to)}
              </div>

              {transaction.note && (
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 3,
                    color: "var(--text-secondary)",
                  }}
                >
                  {transaction.note}
                </div>
              )}
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontWeight: 700,
                  color: getTransactionColor(transaction.type),
                }}
              >
                {transaction.type === "income" && "+"}
                {transaction.type === "expense" && "-"}
                {transaction.type === "transfer" && "-"}{" "}
                {formatMoney(transaction.amount, transaction.currency || "KZT")}
              </div>

              <div
                style={{
                  fontSize: 12,
                  marginTop: 3,
                  color: "var(--text-secondary)",
                }}
              >
                {new Date(transaction.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};