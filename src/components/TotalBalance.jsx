import { useMemo } from "react";
import { useCurrency } from "../context/CurrencyProvider";
import { formatMoney } from "../utils/formatMoney";

export const TotalBalance = ({ accounts }) => {
  const { convert, rates } = useCurrency();

  const baseCurrency = Object.keys(rates)[0] || "KZT";

  /* ===== ЦВЕТА ПО УМОЛЧАНИЮ ===== */
  const getColor = (acc) => {
    if (acc.color) return acc.color;

    const map = {
      cash: "#10b981",
      card: "#3b82f6",
      deposit: "#8b5cf6",
    };

    return map[acc.type] || "var(--primary)";
  };

  /* ===== ПОДГОТОВКА ===== */
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
  }, [accounts, baseCurrency, convert]);

  /* ===== СОРТИРОВКА ===== */
  const sortedAccounts = useMemo(() => {
    const order = {
      cash: 0,
      card: 1,
      deposit: 2,
    };

    return [...accountsWithBase]
      .map((acc, i) => ({ ...acc, _i: i }))
      .sort((a, b) => {
        const typeDiff = order[a.type] - order[b.type];
        if (typeDiff !== 0) return typeDiff;
        return a._i - b._i;
      });
  }, [accountsWithBase]);

  /* ===== TOTAL ===== */
  const total = useMemo(() => {
    return sortedAccounts.reduce(
      (sum, acc) => sum + acc.baseAmount,
      0
    );
  }, [sortedAccounts]);

  return (
    <div
      style={{
        margin: "16px",
        padding: "20px",
        borderRadius: "24px",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.04)",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* ЗАГОЛОВОК */}
      <div
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          fontWeight: 500,
          letterSpacing: 0.5,
        }}
      >
        ОБЩИЙ БАЛАНС
      </div>

      {/* СУММА (НЕ ТРОГАЕМ ЦВЕТ) */}
      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: "var(--primary)",
        }}
      >
        {formatMoney(total, baseCurrency)}
      </div>

      {/* СПИСОК */}
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
              alignItems: "center",
              fontSize: 14,
            }}
          >
            {/* ЛЕВАЯ ЧАСТЬ С ИНДИКАТОРОМ */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* цветной индикатор */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: acc.uiColor,
                }}
              />

              <span style={{ color: "var(--text-secondary)" }}>
                {acc.name}
              </span>
            </div>

            {/* ПРАВАЯ ЧАСТЬ */}
            <div style={{ textAlign: "right", minWidth: 90 }}>
              <div style={{ color: "var(--text)" }}>
                {formatMoney(acc.balance, acc.currency)}
              </div>

              {acc.currency !== baseCurrency && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                  }}
                >
                  ≈ {formatMoney(acc.baseAmount, baseCurrency)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 💎 ПРОГРЕСС */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 999,
            overflow: "hidden",
            display: "flex",
            background: "rgba(0,0,0,0.06)",
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

        {/* проценты */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {sortedAccounts.map((acc) => {
            const percent = total
              ? Math.round((acc.baseAmount / total) * 100)
              : 0;

            return (
              <span
                key={acc.id}
                style={{
                  color: acc.uiColor,
                }}
              >
                {percent}%
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};