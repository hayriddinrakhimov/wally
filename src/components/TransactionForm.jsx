import { useCallback, useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useLocalStorage";

import {
  ShoppingCart,
  Coffee,
  Car,
  Wallet,
  Gift,
  Home,
  Gamepad2,
  Heart,
  Sparkles,
  Plus,
  Check,
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

const formatNumber = (value) => {
  if (!value) return "";
  const numeric = value.replace(/\D/g, "");
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const parseNumber = (value) => Number(value.replace(/\s/g, ""));

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa"];

const defaultCategories = {
  expense: [
    { key: "food", label: "Еда", color: "#60a5fa" },
    { key: "taxi", label: "Такси", color: "#f59e0b" },
  ],
  income: [{ key: "salary", label: "Зарплата", color: "#22c55e" }],
};

export const TransactionForm = ({ type, accounts, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [note, setNote] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [categories, setCategories] = useLocalStorage("categories_v3", defaultCategories);

  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const currentCategories = useMemo(
    () => (type === "transfer" ? [] : categories[type] || []),
    [type, categories]
  );

  const defaultFrom = accounts[0]?.id || "";
  const defaultTo = accounts[1]?.id || accounts[0]?.id || "";

  const fromValue = accounts.some((account) => account.id === from)
    ? from
    : defaultFrom;

  const toValue = accounts.some((account) => account.id === to)
    ? to
    : defaultTo;

  const handleSubmit = useCallback(() => {
    if (typeof onSubmit !== "function") return;

    const numericAmount = parseNumber(amount);
    if (!numericAmount) return;

    const fromAccount = accounts.find((account) => account.id === fromValue);
    const toAccount = accounts.find((account) => account.id === toValue);

    const normalizedCategoryId =
      type === "transfer"
        ? "transfer"
        : categoryId || currentCategories[0]?.key || null;

    if (type !== "transfer" && !normalizedCategoryId) return;

    const transaction = {
      id: Date.now().toString(),
      type,
      amount: numericAmount,
      currency:
        type === "income"
          ? toAccount?.currency || "KZT"
          : fromAccount?.currency || "KZT",
      categoryId: normalizedCategoryId,
      note: note.trim(),
      date: Date.now(),
      from: type === "income" ? "" : fromValue,
      to: type === "expense" ? "" : toValue,
    };

    if (type === "transfer" && fromValue === toValue) {
      transaction.to = toValue;
      transaction.from = fromValue;
    }

    onSubmit(transaction);

    setAmount("");
    setCategoryId(null);
    setNote("");
  }, [
    onSubmit,
    amount,
    accounts,
    type,
    categoryId,
    currentCategories,
    note,
    fromValue,
    toValue,
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
    };

    setCategories((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), newCat],
    }));

    setCategoryId(newCat.key);
    setNewCategory("");
    setAdding(false);
  };

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
        }}
      >
        <input
          value={amount}
          onChange={(event) => setAmount(formatNumber(event.target.value))}
          placeholder="0"
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 32,
            fontWeight: 700,
            border: "none",
            outline: "none",
            background: "transparent",
          }}
        />

        <div
          style={{
            fontWeight: 600,
            opacity: 0.6,
            whiteSpace: "nowrap",
          }}
        >
          KZT
        </div>
      </div>

      {type !== "transfer" && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {currentCategories.map((category) => {
            const Icon = getIcon(category.label);
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
                  background: active
                    ? category.color
                    : `${category.color}22`,
                  color: active ? "#fff" : "#000",
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
              cursor: "pointer",
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
              cursor: "pointer",
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
        style={{
          width: "100%",
          borderRadius: 12,
          border: "1px solid var(--border)",
          padding: "10px 12px",
          background: "var(--card)",
          outline: "none",
        }}
      />

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