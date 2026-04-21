import { useState } from "react";
import { TransactionForm } from "./TransactionForm";

export const TransactionContent = ({
  accounts,
  onSubmit, // ✅ теперь принимаем
}) => {
  const [type, setType] = useState("expense");

  const tabs = [
    { key: "expense", label: "Расход" },
    { key: "income", label: "Доход" },
    { key: "transfer", label: "Перевод" },
  ];

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

      {/* ✅ ВАЖНО: прокидываем onSubmit */}
      <TransactionForm
        type={type}
        accounts={accounts}
        onSubmit={onSubmit}
      />
    </div>
  );
};