import { useMemo } from "react";
import { useCurrency } from "../context/CurrencyProvider";
import { formatMoney } from "../utils/formatMoney";

export const TotalBalance = ({ accounts }) => {
  const { convert, baseCurrency } = useCurrency();

  const getColor = (acc) => {
    const map = {
      cash: "#10b981",
      card: "#3b82f6",
      deposit: "#8b5cf6",
    };

    return acc.color || map[acc.type] || "var(--primary)";
  };

  const enriched = useMemo(() => {
    return accounts.map((acc) => {
      const baseAmount = convert(
        acc.balance,
        acc.currency,
        baseCurrency
      );

      return {
        ...acc,
        baseAmount,
        uiColor: getColor(acc),
      };
    });
  }, [accounts, baseCurrency, convert]);

  const sorted = useMemo(() => {
    const order = {
      cash: 0,
      card: 1,
      deposit: 2,
    };

    return [...enriched].sort(
      (a, b) => order[a.type] - order[b.type]
    );
  }, [enriched]);

  const total = useMemo(() => {
    return sorted.reduce((sum, acc) => sum + acc.baseAmount, 0);
  }, [sorted]);

  return (
    <div
      style={{
        margin: "0 16px",
        padding: 20,
        borderRadius: 24,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      {/* 🔥 STICKY HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg)",
          padding: "6px 0",
          fontSize: 12,
          color: "var(--text-secondary)",
          backdropFilter: "blur(8px)",
        }}
      >
        ОБЩИЙ БАЛАНС
      </div>

      {/* TOTAL */}
      <div
        style={{
          fontSize: 38,
          fontWeight: 700,
          color: "var(--primary)",
        }}
      >
        {formatMoney(total, baseCurrency)}
      </div>

      {/* ACCOUNTS */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {sorted.map((acc) => (
          <div
            key={acc.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "var(--text)" }}>
              {acc.name}
            </span>

            <div style={{ textAlign: "right" }}>
              <div style={{ color: "var(--text)" }}>
                {formatMoney(acc.balance, acc.currency)}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                }}
              >
                ≈ {formatMoney(acc.baseAmount, baseCurrency)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PROGRESS */}
      <div
        style={{
          width: "100%",
          display: "flex",
          height: 8,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        {sorted.map((acc) => {
          const percent = total
            ? (acc.baseAmount / total) * 100
            : 0;

          return (
            <div
              key={acc.id}
              style={{
                width: `${percent}%`,
                background: acc.uiColor,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};