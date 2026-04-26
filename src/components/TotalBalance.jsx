import { useMemo } from "react";
import { useCurrency } from "../context/useCurrency";
import { formatMoney, formatMoneySmart } from "../utils/formatMoney";

export const TotalBalance = ({ accounts }) => {
  const { convert, baseCurrency } = useCurrency();

  const getColor = (account) => {
    const map = {
      cash: "#10b981",
      card: "#3b82f6",
      deposit: "#8b5cf6",
    };

    return account.color || map[account.type] || "var(--primary)";
  };

  const enriched = useMemo(() => {
    return accounts.map((account) => {
      const baseAmount = convert(
        account.balance,
        account.currency,
        baseCurrency
      );

      return {
        ...account,
        baseAmount,
        uiColor: getColor(account),
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

  const total = useMemo(
    () => sorted.reduce((sum, account) => sum + account.baseAmount, 0),
    [sorted]
  );
  const totalLabel = formatMoneySmart(total, baseCurrency);
  const totalFontSize =
    totalLabel.length > 18 ? 26 : totalLabel.length > 14 ? 30 : 34;

  return (
    <div
      style={{
        margin: "0 16px",
        padding: 14,
        borderRadius: 18,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg)",
          padding: "2px 0",
          fontSize: 12,
          color: "var(--text-secondary)",
          backdropFilter: "blur(8px)",
        }}
      >
        ОБЩИЙ БАЛАНС
      </div>

      <div
        style={{
          fontSize: totalFontSize,
          fontWeight: 700,
          color: "var(--primary)",
          lineHeight: 1.15,
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {totalLabel}
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {sorted.map((account) => (
          <div
            key={account.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "var(--text)" }}>{account.name}</span>

            <div style={{ textAlign: "right" }}>
              <div style={{ color: "var(--text)" }}>
                {formatMoneySmart(account.balance, account.currency)}
              </div>

              {account.currency !== baseCurrency && (
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                  }}
                >
                  ≈ {formatMoney(account.baseAmount, baseCurrency)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          height: 8,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        {sorted.map((account) => {
          const percent = total ? (account.baseAmount / total) * 100 : 0;

          return (
            <div
              key={account.id}
              style={{
                width: `${percent}%`,
                background: account.uiColor,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
