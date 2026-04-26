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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
      }}
    >
      {/* ================= FIELDS ================= */}
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
            onChange={(event) =>
              setData({ ...data, from: event.target.value })
            }
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
            onChange={(event) =>
              setData({ ...data, to: event.target.value })
            }
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
      </div>

      {/* ================= ACTIONS (BOTTOM BAR) ================= */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          gap: 10,
        }}
      >
        <button
          onClick={() => onDelete(transaction.id)}
          style={{
            flex: 1,
            padding: 12,
            background: "#ff3b30",
            color: "white",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
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
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};