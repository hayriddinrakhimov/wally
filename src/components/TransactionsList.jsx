import { useMemo } from "react";
import {
  ArrowLeftRight,
  Car,
  Coffee,
  Gamepad2,
  Gift,
  Heart,
  Home,
  ShoppingCart,
  Sparkles,
  Wallet,
} from "lucide-react";
import { categories as staticCategories } from "../data/categories";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getTransactionColor } from "../utils/getTransactionColor";
import { formatMoneySmart } from "../utils/formatMoney";

const CATEGORY_ICON_BY_KEY = {
  shopping: ShoppingCart,
  coffee: Coffee,
  car: Car,
  wallet: Wallet,
  gift: Gift,
  home: Home,
  game: Gamepad2,
  health: Heart,
  sparkles: Sparkles,
  transfer: ArrowLeftRight,
  transport: Car,
};

const defaultCategories = {
  expense: [
    { key: "food", label: "Еда", color: "#60a5fa", iconKey: "shopping" },
    { key: "taxi", label: "Такси", color: "#f59e0b", iconKey: "car" },
  ],
  income: [{ key: "salary", label: "Зарплата", color: "#22c55e", iconKey: "wallet" }],
};

const resolveIcon = (iconKey, type) => {
  if (type === "transfer") return ArrowLeftRight;

  const key = String(iconKey || "")
    .trim()
    .toLowerCase();

  return CATEGORY_ICON_BY_KEY[key] || Sparkles;
};

const createCategoryMap = (customCategories) => {
  const map = new Map();

  staticCategories.forEach((category) => {
    map.set(String(category.id), {
      id: String(category.id),
      name: category.name,
      iconKey: category.iconKey || category.id,
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
        iconKey: String(category?.iconKey || "").trim() || "sparkles",
        color: category?.color || "#a78bfa",
        type,
      });
    });
  });

  return map;
};

export const TransactionsList = ({ transactions = [], accounts = [], onPress }) => {
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
    accounts.find((account) => account.id === id)?.name || "-";

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
        const Icon = resolveIcon(category?.iconKey, transaction.type);
        const iconColor = category?.color || "var(--primary)";
        const iconBackground =
          typeof category?.color === "string" && category.color.startsWith("#")
            ? `${category.color}22`
            : "rgba(59, 130, 246, 0.14)";

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
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  background: iconBackground,
                  color: iconColor,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={15} />
              </span>

              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--text)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {transaction.note}
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
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
