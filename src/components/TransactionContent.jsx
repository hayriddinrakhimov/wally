import { useState } from "react";
import { TransactionForm } from "./TransactionForm";

export const TransactionContent = ({
  accounts,
  subscriptions = [],
  goals = [],
  initialDraft = null,
  onSubmit,
}) => {
  const [type, setType] = useState(initialDraft?.type || "expense");

  const tabs = [
    { key: "expense", label: "Расход" },
    { key: "income", label: "Доход" },
    { key: "transfer", label: "Перевод" },
  ];

  return (
    <div>
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
              height: 38,
              borderRadius: 10,
              border: "none",
              background: type === tab.key ? "var(--bg)" : "transparent",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TransactionForm
        type={type}
        accounts={accounts}
        subscriptions={subscriptions}
        goals={goals}
        initialDraft={initialDraft}
        onSubmit={onSubmit}
      />
    </div>
  );
};
