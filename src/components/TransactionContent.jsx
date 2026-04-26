import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Repeat2 } from "lucide-react";
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
    { key: "expense", label: "Расход", icon: ArrowDownCircle, tint: "#b91c1c" },
    { key: "income", label: "Доход", icon: ArrowUpCircle, tint: "#15803d" },
    { key: "transfer", label: "Перевод", icon: Repeat2, tint: "#6d28d9" },
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
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
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
                color: type === tab.key ? "var(--text)" : "var(--text-secondary)",
                transition: "all 0.2s ease",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: type === tab.key ? tab.tint : "var(--text-secondary)",
                }}
              >
                <Icon size={14} />
                {tab.label}
              </span>
            </button>
          );
        })}
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
