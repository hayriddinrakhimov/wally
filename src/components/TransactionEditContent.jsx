import { useState } from "react";

export const TransactionEditContent = ({
  transaction,
  accounts,
  onSave,
  onDelete,
}) => {
  const [data, setData] = useState(transaction);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        value={data.amount}
        onChange={(e) =>
          setData({ ...data, amount: Number(e.target.value) })
        }
      />

      <button
        onClick={() => onSave(data)}
        style={{ padding: 12, background: "var(--primary)" }}
      >
        Сохранить
      </button>

      <button
        onClick={() => onDelete(transaction.id)}
        style={{ padding: 12, background: "red", color: "white" }}
      >
        Удалить
      </button>
    </div>
  );
};