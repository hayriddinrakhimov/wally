import { useState, useEffect } from "react";

export const TransactionForm = ({ type, accounts, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("cash");
  const [to, setTo] = useState("card");

  useEffect(() => {
    setAmount("");
  }, [type]);

  function handleSubmit() {
    const value = Number(amount);

    if (!value || value <= 0) return;

    const tx = {
      id: Date.now().toString(),
      type,
      amount: value,
      createdAt: new Date().toISOString(),
    };

    if (type === "income") {
      tx.to = to;
    }

    if (type === "expense") {
      tx.from = from;
    }

    if (type === "transfer") {
      if (from === to) return;
      tx.from = from;
      tx.to = to;
    }

    onSubmit(tx);
    setAmount("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* СУММА */}
      <input
        type="number"
        placeholder="Сумма"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          padding: 14,
          borderRadius: 14,
          border: "1px solid var(--border)",
          fontSize: 16,
        }}
      />

      {/* FROM */}
      {type !== "income" && (
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={{
            padding: 14,
            borderRadius: 14,
            border: "1px solid var(--border)",
          }}
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.balance})
            </option>
          ))}
        </select>
      )}

      {/* TO */}
      {type !== "expense" && (
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{
            padding: 14,
            borderRadius: 14,
            border: "1px solid var(--border)",
          }}
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.balance})
            </option>
          ))}
        </select>
      )}

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        style={{
          marginTop: 8,
          padding: 16,
          borderRadius: 16,
          border: "none",
          background: "var(--accent)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        {type === "transfer" ? "Перевести" : "Сохранить"}
      </button>
    </div>
  );
};