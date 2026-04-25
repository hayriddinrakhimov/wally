import { useMemo } from "react";
import { useCurrency } from "../context/CurrencyProvider";
import { formatMoney } from "../utils/formatMoney";

export const TotalBalance = ({ accounts }) => {
  const { convert, baseCurrency, rates } = useCurrency();

  /* ================= COLORS ================= */
  const getColor = (acc) => {
    const map = {
      cash: "#10b981",
      card: "#3b82f6",
      deposit: "#8b5cf6",
    };

    return acc.color || map[acc.type] || "var(--primary)";
  };

  /* ================= ACCOUNTS IN BASE ================= */
  const accountsWithBase = useMemo(() => {
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
  }, [accounts, baseCurrency, convert, rates]);

  /* ================= SORT ================= */
  const sortedAccounts = useMemo(() => {
    const order = {
      cash: 0,
      card: 1,
      deposit: 2,
    };

    return [...accountsWithBase].sort(
      (a, b) => order[a.type] - order[b.type]
    );
  }, [accountsWithBase, rates]);

  /* ================= TOTAL ================= */
  const total = useMemo(() => {
    return sortedAccounts.reduce(
      (sum, acc) => sum + acc.baseAmount,
      0
    );
  }, [sortedAccounts, rates]);

  return (
    <div
      style={{
        margin: 16,
        padding: 20,
        borderRadius: 24,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* TITLE */}
      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
        ОБЩИЙ БАЛАНС
      </div>

      {/* TOTAL */}
      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: "var(--primary)",
        }}
      >
        {formatMoney(total, baseCurrency)}
      </div>

      {/* LIST */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {sortedAccounts.map((acc) => (
          <div
            key={acc.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              {acc.name}
            </span>

            <div style={{ textAlign: "right" }}>
              <div>{formatMoney(acc.balance, acc.currency)}</div>

              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                ≈ {formatMoney(acc.baseAmount, baseCurrency)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div
        style={{
          width: "100%",
          display: "flex",
          height: 10,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        {sortedAccounts.map((acc) => {
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