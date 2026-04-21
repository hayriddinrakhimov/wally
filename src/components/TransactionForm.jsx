import { useState, useEffect } from "react";
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

/* ================= ICON MATCH ================= */

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
    if (item.keys.some((k) => text.includes(k))) {
      return item.icon;
    }
  }
  return Sparkles;
};

/* ================= HELPERS ================= */

const formatNumber = (value) => {
  if (!value) return "";
  const num = value.replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const parseNumber = (value) =>
  Number(value.replace(/\s/g, ""));

/* ================= COLORS ================= */

const COLORS = [
  "#60a5fa",
  "#34d399",
  "#f59e0b",
  "#f472b6",
  "#a78bfa",
];

/* ================= DEFAULT ================= */

const defaultCategories = {
  expense: [
    { key: "food", label: "Еда", color: "#60a5fa" },
    { key: "taxi", label: "Такси", color: "#f59e0b" },
  ],
  income: [
    { key: "salary", label: "Зарплата", color: "#22c55e" },
  ],
};

/* ================= COMPONENT ================= */

export const TransactionForm = ({ type, accounts, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [unexpected, setUnexpected] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [categories, setCategories] = useLocalStorage(
    "categories_v3",
    defaultCategories
  );

  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const currentCategories =
    type === "transfer" ? [] : categories[type] || [];

  useEffect(() => {
    if (accounts.length > 0) {
      setFrom(accounts[0].id);
      setTo(accounts[1]?.id || accounts[0].id);
    }
  }, [accounts]);

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (typeof onSubmit !== "function") {
      console.warn("onSubmit не передан");
      return;
    }

    const value = parseNumber(amount);
    if (!value) return;

    const tx = {
      id: Date.now().toString(),
      type,
      amount: value,
      category,
      unexpected,
      createdAt: new Date().toISOString(),
    };

    if (type === "expense") tx.from = from;
    if (type === "income") tx.to = to;
    if (type === "transfer") {
      tx.from = from;
      tx.to = to;
    }

    onSubmit(tx);

    setAmount("");
    setCategory(null);
  };

  useEffect(() => {
    const handler = () => handleSubmit();
    document.addEventListener("submitTransaction", handler);
    return () =>
      document.removeEventListener("submitTransaction", handler);
  });

  /* ================= ADD CATEGORY ================= */

  const addCategory = () => {
    if (!newCategory.trim()) return;

    const newCat = {
      key: Date.now().toString(),
      label: newCategory,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    setCategories((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), newCat],
    }));

    setNewCategory("");
    setAdding(false);
  };

  /* ================= UI ================= */

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      
      {/* 💰 AMOUNT */}
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
          onChange={(e) =>
            setAmount(formatNumber(e.target.value))
          }
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
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginLeft: 8,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              opacity: 0.6,
              whiteSpace: "nowrap",
            }}
          >
            ₸
          </div>

          {/* ⚡ квадрат */}
          <div
            onClick={() => setUnexpected(!unexpected)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: unexpected
                ? "var(--primary)"
                : "var(--bg-secondary)",
              color: unexpected ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            ⚡
          </div>
        </div>
      </div>

      {/* 📂 CATEGORIES */}
      {type !== "transfer" && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {currentCategories.map((cat) => {
            const Icon = getIcon(cat.label);
            const active = category === cat.key;

            return (
              <motion.div
                key={cat.key}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCategory(cat.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 14,
                  cursor: "pointer",
                  background: active
                    ? cat.color
                    : `${cat.color}22`,
                  color: active ? "#fff" : "#000",
                }}
              >
                <Icon size={16} />
                {cat.label}
              </motion.div>
            );
          })}

          {/* ➕ квадрат */}
          <div
            onClick={() => setAdding(true)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed var(--border)",
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
          </div>
        </div>
      )}

      {/* ➕ ADD CATEGORY */}
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
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Новая категория"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
            }}
          />

          <div
            onClick={addCategory}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--primary)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Check size={16} />
          </div>
        </div>
      )}

      {/* 💳 ACCOUNTS */}

      {type === "expense" && (
        <AccountCard
          label="Списать с"
          value={from}
          setValue={setFrom}
          accounts={accounts}
        />
      )}

      {type === "income" && (
        <AccountCard
          label="Зачислить на"
          value={to}
          setValue={setTo}
          accounts={accounts}
        />
      )}

      {type === "transfer" && (
        <>
          <AccountCard
            label="Списать с"
            value={from}
            setValue={setFrom}
            accounts={accounts}
          />
          <AccountCard
            label="Зачислить на"
            value={to}
            setValue={setTo}
            accounts={accounts}
          />
        </>
      )}
    </div>
  );
};

/* ================= ACCOUNT CARD ================= */

const AccountCard = ({ label, value, setValue, accounts }) => {
  const acc = accounts.find((a) => a.id === value);

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        const i = accounts.findIndex((a) => a.id === value);
        setValue(accounts[(i + 1) % accounts.length].id);
      }}
      style={{
        padding: 16,
        borderRadius: 16,
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{acc?.name}</div>
      <div style={{ opacity: 0.6 }}>{acc?.balance} ₸</div>
    </motion.div>
  );
};