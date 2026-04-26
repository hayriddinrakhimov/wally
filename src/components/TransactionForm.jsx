import { useCallback, useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useCurrency } from "../context/useCurrency";
import { formatMoneySmart } from "../utils/formatMoney";
import {
  Car,
  Check,
  Coffee,
  Gamepad2,
  Gift,
  Heart,
  Home,
  Plus,
  ShoppingCart,
  Sparkles,
  Wallet,
} from "lucide-react";

const ICON_KEYWORDS = [
  { keys: ["еда", "food", "продукт"], icon: ShoppingCart },
  { keys: ["кофе", "cafe", "coffee"], icon: Coffee },
  { keys: ["такси", "машин", "car", "транспорт"], icon: Car },
  { keys: ["зарплата", "income", "salary"], icon: Wallet },
  { keys: ["подарок", "gift"], icon: Gift },
  { keys: ["дом", "аренда", "home", "rent"], icon: Home },
  { keys: ["игра", "fun", "game"], icon: Gamepad2 },
  { keys: ["здоров", "health"], icon: Heart },
];

const getIcon = (label = "") => {
  const text = label.toLowerCase();
  for (const item of ICON_KEYWORDS) {
    if (item.keys.some((key) => text.includes(key))) {
      return item.icon;
    }
  }
  return Sparkles;
};

const ICON_OPTIONS = [
  { key: "shopping", icon: ShoppingCart },
  { key: "coffee", icon: Coffee },
  { key: "car", icon: Car },
  { key: "wallet", icon: Wallet },
  { key: "gift", icon: Gift },
  { key: "home", icon: Home },
  { key: "game", icon: Gamepad2 },
  { key: "health", icon: Heart },
  { key: "sparkles", icon: Sparkles },
];

const resolveCategoryIcon = (category) => {
  const iconKey = String(category?.iconKey || "").trim();
  const fromKey = ICON_OPTIONS.find((item) => item.key === iconKey);
  if (fromKey) return fromKey.icon;

  return getIcon(`${category?.label || ""} ${category?.key || ""}`);
};

const formatNumber = (value) => {
  if (!value) return "";
  const numeric = value.replace(/\D/g, "");
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const parseNumber = (value) => Number(String(value || "").replace(/\s/g, ""));

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa"];

const defaultCategories = {
  expense: [
    { key: "food", label: "Еда", color: "#60a5fa" },
    { key: "taxi", label: "Такси", color: "#f59e0b" },
  ],
  income: [{ key: "salary", label: "Зарплата", color: "#22c55e" }],
};

export const TransactionForm = ({
  type,
  accounts,
  subscriptions = [],
  goals = [],
  initialDraft = null,
  onSubmit,
}) => {
  const { watchlist, baseCurrency, convert } = useCurrency();
  const [categories, setCategories] = useLocalStorage(
    "categories_v3",
    defaultCategories
  );

  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryIconKey, setNewCategoryIconKey] = useState("sparkles");

  const currentCategories = useMemo(
    () => (type === "transfer" ? [] : categories[type] || []),
    [type, categories]
  );

  const defaultFrom = accounts[0]?.id || "";
  const defaultTo = accounts[1]?.id || accounts[0]?.id || "";
  const draft = initialDraft || {};

  const [amount, setAmount] = useState(() =>
    draft.amount && Number.isFinite(Number(draft.amount))
      ? formatNumber(String(draft.amount))
      : ""
  );
  const [categoryId, setCategoryId] = useState(() =>
    type === "transfer" ? "transfer" : draft.categoryId || null
  );
  const [note, setNote] = useState(() => String(draft.note || ""));
  const [from, setFrom] = useState(
    () => draft.from || draft.fromAccountId || defaultFrom
  );
  const [to, setTo] = useState(() => draft.to || draft.toAccountId || defaultTo);
  const [subscriptionId, setSubscriptionId] = useState(
    () => draft.subscriptionId || ""
  );
  const [goalId, setGoalId] = useState(() => draft.goalId || "");
  const [currency, setCurrency] = useState(() => {
    const draftCurrency = String(draft.currency || "").toUpperCase();
    if (draftCurrency) return draftCurrency;

    const accountCurrency =
      accounts.find(
        (account) =>
          account.id === (draft.from || draft.fromAccountId || draft.to || draft.toAccountId)
      )?.currency || baseCurrency;

    return accountCurrency || "KZT";
  });

  const fromValue = accounts.some((account) => account.id === from)
    ? from
    : defaultFrom;
  const toValue = accounts.some((account) => account.id === to) ? to : defaultTo;

  const currencyOptions = useMemo(() => {
    const set = new Set([baseCurrency, ...(watchlist || []), currency, "KZT"]);
    return Array.from(set).filter(Boolean);
  }, [baseCurrency, watchlist, currency]);
  const amountDigits = String(amount || "").replace(/\D/g, "").length;
  const amountFontSize = amountDigits > 12 ? 24 : amountDigits > 9 ? 28 : 32;
  const parsedAmount = parseNumber(amount);
  const amountInBase = convert(parsedAmount, currency, baseCurrency);
  const showAmountInBase =
    parsedAmount > 0 && currency && baseCurrency && currency !== baseCurrency;

  useEffect(() => {
    if (type === "transfer") {
      if (categoryId !== "transfer") {
        setCategoryId("transfer");
      }
      return;
    }

    if (!currentCategories.length) {
      setCategoryId(null);
      return;
    }

    const hasSelected = currentCategories.some((item) => item.key === categoryId);
    if (!hasSelected) {
      setCategoryId(currentCategories[0].key);
    }
  }, [type, currentCategories, categoryId]);

  const handleSubmit = useCallback(() => {
    if (typeof onSubmit !== "function") return;

    const numericAmount = parseNumber(amount);
    if (!numericAmount) return;

    const normalizedCategoryId =
      type === "transfer"
        ? "transfer"
        : categoryId || currentCategories[0]?.key || null;

    if (type !== "transfer" && !normalizedCategoryId) return;

    const transaction = {
      id: Date.now().toString(),
      type,
      amount: numericAmount,
      currency: currency || "KZT",
      categoryId: normalizedCategoryId,
      note: note.trim(),
      date: Date.now(),
      from: type === "income" ? "" : fromValue,
      to: type === "expense" ? "" : toValue,
      subscriptionId: subscriptionId || null,
      goalId: goalId || null,
    };

    onSubmit(transaction);

    setAmount("");
    setCategoryId(type === "transfer" ? "transfer" : null);
    setNote("");
    setSubscriptionId("");
    setGoalId("");
  }, [
    onSubmit,
    amount,
    type,
    currency,
    categoryId,
    currentCategories,
    note,
    fromValue,
    toValue,
    subscriptionId,
    goalId,
  ]);

  useEffect(() => {
    const handler = () => handleSubmit();
    document.addEventListener("submitTransaction", handler);
    return () => {
      document.removeEventListener("submitTransaction", handler);
    };
  }, [handleSubmit]);

  const addCategory = () => {
    const normalizedLabel = newCategory.trim();
    if (!normalizedLabel || type === "transfer") return;

    const newCat = {
      key: Date.now().toString(),
      label: normalizedLabel,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      iconKey: newCategoryIconKey,
    };

    setCategories((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), newCat],
    }));

    setCategoryId(newCat.key);
    setNewCategory("");
    setNewCategoryIconKey("sparkles");
    setAdding(false);
  };

  const activeSubscriptions = subscriptions.filter(
    (item) => item?.isActive || item?.id === subscriptionId
  );
  const activeGoals = goals.filter((item) => item?.isActive || item?.id === goalId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: 20,
          padding: "14px 16px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          gap: 8,
        }}
      >
        <input
          value={amount}
          onChange={(event) => setAmount(formatNumber(event.target.value))}
          placeholder="0"
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: amountFontSize,
            fontWeight: 700,
            border: "none",
            outline: "none",
            background: "transparent",
            lineHeight: 1.2,
          }}
        />

        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          style={{
            minWidth: 80,
            height: 34,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg)",
            padding: "0 8px",
            fontWeight: 700,
          }}
        >
          {currencyOptions.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      {showAmountInBase && (
        <div
          style={{
            marginTop: -8,
            fontSize: 12,
            color: "var(--text-secondary)",
            textAlign: "right",
          }}
        >
          ≈ {formatMoneySmart(amountInBase, baseCurrency)}
        </div>
      )}

      {type !== "transfer" && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {currentCategories.map((category) => {
            const Icon = resolveCategoryIcon(category);
            const active = categoryId === category.key;

            return (
              <motion.div
                key={category.key}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCategoryId(category.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 14,
                  cursor: "pointer",
                  background: active ? category.color : `${category.color}22`,
                  color: active ? "#fff" : "#000",
                  maxWidth: 170,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} />
                {category.label}
              </motion.div>
            );
          })}

          <button
            type="button"
            onClick={() => setAdding(true)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px dashed var(--border)",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      {adding && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: 16,
            padding: "10px 12px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            gap: 8,
          }}
        >
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            placeholder="Новая категория"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
            }}
          />

          <button
            type="button"
            onClick={addCategory}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={16} />
          </button>
        </div>
      )}

      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Комментарий (необязательно)"
        style={inputStyle}
      />

      <select
        value={subscriptionId}
        onChange={(event) => {
          const nextId = event.target.value;
          setSubscriptionId(nextId);

          const selected = subscriptions.find((item) => item.id === nextId);
          if (selected?.currency) {
            setCurrency(selected.currency);
          }
        }}
        style={inputStyle}
      >
        <option value="">Без подписки</option>
        {activeSubscriptions.map((subscription) => (
          <option key={subscription.id} value={subscription.id}>
            {subscription.name}
          </option>
        ))}
      </select>

      <select
        value={goalId}
        onChange={(event) => setGoalId(event.target.value)}
        style={inputStyle}
      >
        <option value="">Без цели</option>
        {activeGoals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.title}
          </option>
        ))}
      </select>

      {type === "expense" && (
        <AccountCard
          label="Списать с"
          value={fromValue}
          setValue={setFrom}
          accounts={accounts}
        />
      )}

      {type === "income" && (
        <AccountCard
          label="Зачислить на"
          value={toValue}
          setValue={setTo}
          accounts={accounts}
        />
      )}

      {type === "transfer" && (
        <>
          <AccountCard
            label="Списать с"
            value={fromValue}
            setValue={setFrom}
            accounts={accounts}
          />
          <AccountCard
            label="Зачислить на"
            value={toValue}
            setValue={setTo}
            accounts={accounts}
          />
        </>
      )}
    </div>
  );
};

const AccountCard = ({ label, value, setValue, accounts }) => {
  const account = accounts.find((item) => item.id === value);

  if (!accounts.length) {
    return (
      <div
        style={{
          padding: 16,
          borderRadius: 16,
          background: "var(--card)",
          border: "1px solid var(--border)",
          opacity: 0.6,
        }}
      >
        Нет счетов
      </div>
    );
  }

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        const index = accounts.findIndex((item) => item.id === value);
        const nextIndex = index >= 0 ? (index + 1) % accounts.length : 0;
        setValue(accounts[nextIndex].id);
      }}
      style={{
        padding: 16,
        borderRadius: 16,
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{account?.name || "—"}</div>
      <div style={{ opacity: 0.6 }}>{account?.balance || 0} KZT</div>
    </motion.div>
  );
};

const inputStyle = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid var(--border)",
  padding: "10px 12px",
  background: "var(--card)",
  outline: "none",
};
