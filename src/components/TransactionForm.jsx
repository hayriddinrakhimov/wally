import { useState, useEffect } from "react";

export const TransactionForm = ({ type, accounts, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && !from && !to) {
      setFrom(accounts[0].id);
      setTo(accounts[1]?.id || accounts[0].id);
    }
  }, [accounts]);

  const getAccount = (id) =>
    accounts.find((acc) => acc.id === id);

  function handleSubmit() {
    const value = Number(amount);
    if (!value || value <= 0) return;

    const tx = {
      id: Date.now().toString(),
      type,
      amount: value,
      createdAt: new Date().toISOString(),
    };

    if (type === "income") tx.to = to;
    if (type === "expense") tx.from = from;

    if (type === "transfer") {
      if (from === to) return;
      tx.from = from;
      tx.to = to;
    }

    onSubmit(tx);
    setAmount("");
  }

  const dropdownStyle = {
    padding: 14,
    borderRadius: 14,
    border: "1px solid var(--border)",
    cursor: "pointer",
    background: "var(--bg)",
  };

  const listStyle = {
    marginTop: 6,
    borderRadius: 12,
    border: "1px solid var(--border)",
    overflow: "hidden",
  };

  const itemStyle = {
    padding: 12,
    cursor: "pointer",
    background: "var(--bg)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* СУММА */}
      <input
        type="text"
        inputMode="decimal"   // ✅ мобильная цифровая клавиатура
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
        <div>
          <div
            style={dropdownStyle}
            onClick={() => setOpenFrom(!openFrom)}
          >
            {getAccount(from)?.name || "Выбрать счет"}
          </div>

          {openFrom && (
            <div style={listStyle}>
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  style={itemStyle}
                  onClick={() => {
                    setFrom(acc.id);
                    setOpenFrom(false);
                  }}
                >
                  {acc.name} ({acc.balance})
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TO */}
      {type !== "expense" && (
        <div>
          <div
            style={dropdownStyle}
            onClick={() => setOpenTo(!openTo)}
          >
            {getAccount(to)?.name || "Выбрать счет"}
          </div>

          {openTo && (
            <div style={listStyle}>
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  style={itemStyle}
                  onClick={() => {
                    setTo(acc.id);
                    setOpenTo(false);
                  }}
                >
                  {acc.name} ({acc.balance})
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        style={{
          marginTop: 8,
          padding: 16,
          borderRadius: 16,
          border: "none",
          background: "var(--primary)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        {type === "transfer" ? "Перевести" : "Сохранить"}
      </button>
    </div>
  );
};