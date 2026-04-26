import { useCallback, useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
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
  X,
} from "lucide-react";

const ICON_KEY_DEFAULT = "sparkles";

const ICON_KEYWORDS = [
  { keys: ["еда", "продукт", "продукты", "food", "grocery", "meal"], key: "shopping" },
  { keys: ["кофе", "кафе", "coffee", "cafe"], key: "coffee" },
  {
    keys: ["такси", "машин", "бензин", "транспорт", "car", "taxi", "fuel", "bus"],
    key: "car",
  },
  { keys: ["зарплат", "доход", "income", "salary", "work"], key: "wallet" },
  { keys: ["подар", "gift", "present"], key: "gift" },
  { keys: ["дом", "аренд", "home", "rent", "flat"], key: "home" },
  { keys: ["игр", "развлеч", "fun", "game", "play"], key: "game" },
  { keys: ["здоров", "мед", "doctor", "medical", "health"], key: "health" },
];

const ICON_OPTIONS = [
  { key: "shopping", icon: ShoppingCart, label: "Еда" },
  { key: "coffee", icon: Coffee, label: "Кофе" },
  { key: "car", icon: Car, label: "Транспорт" },
  { key: "wallet", icon: Wallet, label: "Доход" },
  { key: "gift", icon: Gift, label: "Подарки" },
  { key: "home", icon: Home, label: "Дом" },
  { key: "game", icon: Gamepad2, label: "Досуг" },
  { key: "health", icon: Heart, label: "Здоровье" },
  { key: "sparkles", icon: Sparkles, label: "Другое" },
];

const ICON_BY_KEY = ICON_OPTIONS.reduce((acc, option) => {
  acc[option.key] = option.icon;
  return acc;
}, {});

const getSuggestedIconKey = (label = "") => {
  const text = String(label).toLowerCase().trim();
  if (!text) return ICON_KEY_DEFAULT;

  const matched = ICON_KEYWORDS.find((item) =>
    item.keys.some((key) => text.includes(key))
  );

  return matched?.key || ICON_KEY_DEFAULT;
};

const resolveCategoryIcon = (category) => {
  const iconKey = String(category?.iconKey || "").trim();
  if (iconKey && ICON_BY_KEY[iconKey]) return ICON_BY_KEY[iconKey];

  const fallbackKey = getSuggestedIconKey(
    `${category?.label || ""} ${category?.key || ""}`
  );
  return ICON_BY_KEY[fallbackKey] || Sparkles;
};

const formatNumber = (value) => {
  if (!value) return "";
  const numeric = String(value).replace(/\D/g, "");
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const parseNumber = (value) => Number(String(value || "").replace(/\s/g, ""));

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa"];

const defaultCategories = {
  expense: [
    { key: "food", label: "Еда", color: "#60a5fa", iconKey: "shopping" },
    { key: "taxi", label: "Такси", color: "#f59e0b", iconKey: "car" },
  ],
  income: [
    { key: "salary", label: "Зарплата", color: "#22c55e", iconKey: "wallet" },
  ],
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
  const [newCategoryIconKey, setNewCategoryIconKey] = useState(ICON_KEY_DEFAULT);
  const [isIconManual, setIsIconManual] = useState(false);

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
          account.id ===
          (draft.from || draft.fromAccountId || draft.to || draft.toAccountId)
      )?.currency || baseCurrency;

    return accountCurrency || baseCurrency || "KZT";
  });

  const fromValue = accounts.some((account) => account.id === from)
    ? from
    : defaultFrom;

  const rawToValue = accounts.some((account) => account.id === to) ? to : defaultTo;

  const toValue = useMemo(() => {
    if (type !== "transfer" || accounts.length < 2) return rawToValue;
    if (!fromValue || fromValue !== rawToValue) return rawToValue;

    return accounts.find((account) => account.id !== fromValue)?.id || rawToValue;
  }, [type, accounts, fromValue, rawToValue]);

  const currencyOptions = useMemo(
    () => Array.from(new Set([baseCurrency, ...(watchlist || []), currency])).filter(Boolean),
    [baseCurrency, watchlist, currency]
  );

  const resolvedCategoryId = useMemo(() => {
    if (type === "transfer") return "transfer";
    if (!currentCategories.length) return null;

    if (categoryId && currentCategories.some((item) => item.key === categoryId)) {
      return categoryId;
    }

    return currentCategories[0].key;
  }, [type, currentCategories, categoryId]);

  const amountDigits = String(amount || "").replace(/\D/g, "").length;
  const amountFontSize = amountDigits > 12 ? 24 : amountDigits > 9 ? 28 : 32;
  const parsedAmount = parseNumber(amount);
  const amountInBase = convert(parsedAmount, currency, baseCurrency);
  const showAmountInBase =
    parsedAmount > 0 && currency && baseCurrency && currency !== baseCurrency;

  const newCategoryLabel = newCategory.trim();
  const canSaveCategory = Boolean(newCategoryLabel);

  const closeAddCategory = useCallback(() => {
    setAdding(false);
    setNewCategory("");
    setNewCategoryIconKey(ICON_KEY_DEFAULT);
    setIsIconManual(false);
  }, []);

  const openAddCategory = useCallback(() => {
    setAdding(true);
    setNewCategory("");
    setNewCategoryIconKey(ICON_KEY_DEFAULT);
    setIsIconManual(false);
  }, []);

  const selectCategoryIcon = useCallback((iconKey) => {
    setNewCategoryIconKey(iconKey);
    setIsIconManual(true);
  }, []);

  const handleCategoryNameChange = useCallback(
    (nextValue) => {
      setNewCategory(nextValue);
      if (!isIconManual) {
        setNewCategoryIconKey(getSuggestedIconKey(nextValue));
      }
    },
    [isIconManual]
  );

  const handleSubmit = useCallback(() => {
    if (typeof onSubmit !== "function") return;

    const numericAmount = parseNumber(amount);
    if (!numericAmount) return;

    const normalizedCategoryId =
      type === "transfer" ? "transfer" : resolvedCategoryId;

    if (type !== "transfer" && !normalizedCategoryId) return;
    if (type === "transfer" && (!fromValue || !toValue || fromValue === toValue)) {
      return;
    }

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
    resolvedCategoryId,
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
    const normalizedLabel = newCategoryLabel;
    if (!normalizedLabel || type === "transfer") return;

    const existingCategory = currentCategories.find(
      (category) =>
        String(category.label || "")
          .trim()
          .toLowerCase() === normalizedLabel.toLowerCase()
    );

    if (existingCategory) {
      setCategoryId(existingCategory.key);
      closeAddCategory();
      return;
    }

    const newCat = {
      key: Date.now().toString(),
      label: normalizedLabel,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      iconKey: newCategoryIconKey || getSuggestedIconKey(normalizedLabel),
    };

    setCategories((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), newCat],
    }));

    setCategoryId(newCat.key);
    closeAddCategory();
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
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {currentCategories.map((category) => {
            const Icon = resolveCategoryIcon(category);
            const active = resolvedCategoryId === category.key;

            return (
              <Motion.button
                key={category.key}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setCategoryId(category.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 14,
                  cursor: "pointer",
                  border: "none",
                  background: active ? category.color : `${category.color}22`,
                  color: active ? "#fff" : "var(--text)",
                  maxWidth: 170,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flexShrink: 0,
                  fontWeight: 600,
                }}
              >
                <Icon size={16} />
                {category.label}
              </Motion.button>
            );
          })}

          <button
            type="button"
            onClick={() => (adding ? closeAddCategory() : openAddCategory())}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px dashed var(--border)",
              background: adding ? "var(--primary)" : "transparent",
              color: adding ? "#fff" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            <Motion.span
              animate={{ rotate: adding ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "inline-flex" }}
            >
              <Plus size={16} />
            </Motion.span>
          </button>
        </div>
      )}

      {adding && type !== "transfer" && (
        <Motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            borderRadius: 16,
            padding: "10px 12px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              value={newCategory}
              onChange={(event) => handleCategoryNameChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addCategory();
                if (event.key === "Escape") closeAddCategory();
              }}
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
              onClick={closeAddCategory}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={15} />
            </button>

            <button
              type="button"
              onClick={addCategory}
              disabled={!canSaveCategory}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: canSaveCategory ? 1 : 0.45,
              }}
            >
              <Check size={15} />
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
            {ICON_OPTIONS.map((item) => {
              const Icon = item.icon;
              const active = newCategoryIconKey === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => selectCategoryIcon(item.key)}
                  style={{
                    minWidth: 74,
                    height: 54,
                    borderRadius: 12,
                    border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
                    background: active ? "rgba(59, 130, 246, 0.12)" : "var(--bg)",
                    color: active ? "var(--primary)" : "var(--text-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    fontSize: 10,
                    flexShrink: 0,
                    fontWeight: 600,
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </Motion.div>
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
    <Motion.div
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
      <div style={{ opacity: 0.6 }}>
        {formatMoneySmart(account?.balance || 0, account?.currency || "KZT")}
      </div>
    </Motion.div>
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

