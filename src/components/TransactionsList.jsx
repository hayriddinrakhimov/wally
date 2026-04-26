import { useMemo } from "react";
import { categories as staticCategories } from "../data/categories";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getTransactionColor } from "../utils/getTransactionColor";
import { formatMoneySmart } from "../utils/formatMoney";

const CATEGORY_EMOJI_BY_ICON = {
  shopping: "🛒",
  coffee: "☕",
  car: "🚕",
  wallet: "💰",
  gift: "🎁",
  home: "🏠",
  game: "🎮",
  health: "❤️",
  sparkles: "✨",
};

const defaultCategories = {
  expense: [
    { key: "food", label: "Еда", color: "#60a5fa", iconKey: "shopping" },
    { key: "taxi", label: "Такси", color: "#f59e0b", iconKey: "car" },
  ],
  income: [
    { key: "salary", label: "Зарплата", color: "#22c55e", iconKey: "wallet" },
  ],
};

const createCategoryMap = (customCategories) => {
  const map = new Map();

  staticCategories.forEach((category) => {
    map.set(String(category.id), {
      id: String(category.id),
      name: category.name,
      icon: category.icon || "✨",
      color: category.color,
      type: category.type,
    });
  });

  ["expense", "income"].forEach((type) => {
    (customCategories?.[type] || []).forEach((category) => {
      const id = String(category?.key || "").trim();
      if (!id) return;

      map.set(id, {
        id,
        name: String(category?.label || "").trim() || id,
        icon: CATEGORY_EMOJI_BY_ICON[category?.iconKey] || "✨",
        color: category?.color || "#a78bfa",
        type,
      });
    });
  });

  return map;
};

export const TransactionsList = ({
  transactions = [],
  accounts = [],
  onPress,
}) => {
  const [customCategories] = useLocalStorage("categories_v3", defaultCategories);

  const categoryMap = useMemo(
    () => createCategoryMap(customCategories),
    [customCategories]
  );

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

  const getCategory = (id) => categoryMap.get(String(id || ""));

  return (
    <div style={{ padding: "0 12px", marginTop: 12 }}>
      {transactions.map((transaction) => {
        const from = transaction.from || transaction.fromAccountId;
        const to = transaction.to || transaction.toAccountId;
        const categoryId = transaction.categoryId || transaction.category || null;

        const category = getCategory(categoryId);
        const isTransfer = transaction.type === "transfer";
        const categoryBadge = isTransfer ? "🔄" : category?.icon || "✨";
        const amountLabel = formatMoneySmart(
          transaction.amount,
          transaction.currency || "KZT"
        );

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
                {categoryBadge} {title}
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
                  maxWidth: 140,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {transaction.type === "income" && "+"}
                {transaction.type === "expense" && "-"}
                {transaction.type === "transfer" && "-"} {amountLabel}
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