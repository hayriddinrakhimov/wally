import { useEffect, useState } from "react";
import { useCurrency } from "../context/useCurrency";

export const TransactionEditContent = ({
  transaction,
  accounts,
  subscriptions = [],
  goals = [],
  onSave,
  onDelete,
}) => {
  const { watchlist, baseCurrency } = useCurrency();
  const [data, setData] = useState(transaction);

  useEffect(() => {
    setData(transaction);
  }, [transaction]);

  const fromOptions = accounts || [];
  const toOptions = accounts || [];
  const currencyOptions = Array.from(
    new Set([baseCurrency, ...(watchlist || []), data?.currency || "KZT", "KZT"])
  ).filter(Boolean);

  const save = () => {
    const amount = Number(data.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;

    onSave({
      ...data,
      amount,
      note: String(data.note || "").trim(),
      subscriptionId: data.subscriptionId || null,
      goalId: data.goalId || null,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          value={data.amount}
          onChange={(event) =>
            setData({ ...data, amount: Number(event.target.value) })
          }
          type="number"
          min="0"
          style={inputStyle}
        />

        <select
          value={data.currency || "KZT"}
          onChange={(event) =>
            setData({ ...data, currency: event.target.value })
          }
          style={inputStyle}
        >
          {currencyOptions.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>

        <input
          value={data.note || ""}
          onChange={(event) => setData({ ...data, note: event.target.value })}
          placeholder="Комментарий"
          style={inputStyle}
        />

        <select
          value={data.subscriptionId || ""}
          onChange={(event) =>
            setData({ ...data, subscriptionId: event.target.value || null })
          }
          style={inputStyle}
        >
          <option value="">Без подписки</option>
          {subscriptions
            .filter((subscription) => subscription?.isActive || subscription?.id === data.subscriptionId)
            .map((subscription) => (
              <option key={subscription.id} value={subscription.id}>
                {subscription.name}
              </option>
            ))}
        </select>

        <select
          value={data.goalId || ""}
          onChange={(event) =>
            setData({ ...data, goalId: event.target.value || null })
          }
          style={inputStyle}
        >
          <option value="">Без цели</option>
          {goals
            .filter((goal) => goal?.isActive || goal?.id === data.goalId)
            .map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
        </select>

        {(data.type === "expense" || data.type === "transfer") && (
          <select
            value={data.from || ""}
            onChange={(event) => setData({ ...data, from: event.target.value })}
            style={inputStyle}
          >
            {fromOptions.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        )}

        {(data.type === "income" || data.type === "transfer") && (
          <select
            value={data.to || ""}
            onChange={(event) => setData({ ...data, to: event.target.value })}
            style={inputStyle}
          >
            {toOptions.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
        <button
          onClick={() => onDelete(transaction.id)}
          style={{
            flex: 1,
            padding: 12,
            background: "#ff3b30",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontWeight: 600,
          }}
        >
          Удалить
        </button>

        <button
          onClick={save}
          style={{
            flex: 1,
            padding: 12,
            background: "var(--primary)",
            border: "none",
            borderRadius: 12,
            color: "white",
            fontWeight: 600,
          }}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid var(--border)",
  outline: "none",
};
