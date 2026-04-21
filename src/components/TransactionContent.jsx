import { useState } from "react";
import { TransactionForm } from "./TransactionForm";

export const TransactionContent = ({
  accounts,
  onChange,
}) => {
  const [type, setType] = useState("expense");
  const [formData, setFormData] = useState({});

  const tabs = [
    { key: "expense", label: "Расход" },
    { key: "income", label: "Доход" },
    { key: "transfer", label: "Перевод" },
  ];

  // 🔥 ВАЛИДАЦИЯ
  const validate = (data) => {
    if (!data.amount || Number(data.amount) <= 0) return false;

    if (type === "expense" && !data.from) return false;
    if (type === "income" && !data.to) return false;

    if (type === "transfer") {
      if (!data.from || !data.to) return false;
      if (data.from === data.to) return false;
    }

    return true;
  };

  return (
    <div>
      {/* TABS */}
      <div
        style={{
          display: "flex",
          background: "var(--border)",
          borderRadius: 14,
          padding: 4,
          marginBottom: 16,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setType(tab.key)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "none",
              background:
                type === tab.key ? "var(--bg)" : "transparent",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TransactionForm
        type={type}
        accounts={accounts}
        onChange={(data) => {
          const full = { ...data, type };
          setFormData(full);

          const isValid = validate(full);

          onChange?.({
            data: full,
            isValid,
          });
        }}
      />
    </div>
  );
};