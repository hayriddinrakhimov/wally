import { useEffect, useState } from "react";

export const TransactionEditContent = ({
  transaction,
  accounts,
  onSave,
  onDelete,
}) => {
  const [data, setData] = useState(transaction);

  useEffect(() => {
    setData(transaction);
  }, [transaction]);

  const fromOptions = accounts || [];
  const toOptions = accounts || [];

  const save = () => {
    const amount = Number(data.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;

    onSave({
      ...data,
      amount,
      note: String(data.note || "").trim(),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        value={data.amount}
        onChange={(event) =>
          setData({ ...data, amount: Number(event.target.value) })
        }
        type="number"
        min="0"
        style={{
          padding: 12,
          borderRadius: 10,
          border: "1px solid var(--border)",
          outline: "none",
        }}
      />

      <input
        value={data.note || ""}
        onChange={(event) =>
          setData({ ...data, note: event.target.value })
        }
        placeholder="Комментарий"
        style={{
          padding: 12,
          borderRadius: 10,
          border: "1px solid var(--border)",
          outline: "none",
        }}
      />

      {(data.type === "expense" || data.type === "transfer") && (
        <select
          value={data.from || ""}
          onChange={(event) => setData({ ...data, from: event.target.value })}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid var(--border)",
            outline: "none",
          }}
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
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid var(--border)",
            outline: "none",
          }}
        >
          {toOptions.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={save}
        style={{
          padding: 12,
          background: "var(--primary)",
          border: "none",
          borderRadius: 10,
          color: "white",
          cursor: "pointer",
        }}
      >
        Сохранить
      </button>

      <button
        onClick={() => onDelete(transaction.id)}
        style={{
          padding: 12,
          background: "red",
          color: "white",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        Удалить
      </button>
    </div>
  );
};