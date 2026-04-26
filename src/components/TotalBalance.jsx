import { useMemo } from "react";
import { useCurrency } from "../context/useCurrency";
import { formatMoney, formatMoneySmart } from "../utils/formatMoney";

const TYPE_LABELS = {
  cash: "Наличные",
  card: "Карта",
  deposit: "Депозит",
};

const getAccountColor = (account) => {
  const map = {
    cash: "#10b981",
    card: "#3b82f6",
    deposit: "#f59e0b",
  };

  return account?.color || map[account?.type] || "var(--primary)";
};

const TotalBalance = ({ accounts = [] }) => {
  const { convert, baseCurrency } = useCurrency();

  const enriched = useMemo(() => {
    return accounts.map((account) => {
      const convertedAmount = convert(
        Number(account.balance) || 0,
        account.currency,
        baseCurrency
      );

      const baseAmount = Number.isFinite(convertedAmount) ? convertedAmount : 0;

      return {
        ...account,
        baseAmount,
        uiColor: getAccountColor(account),
      };
    });
  }, [accounts, baseCurrency, convert]);

  const sorted = useMemo(() => {
    return [...enriched].sort(
      (a, b) => Math.abs(b.baseAmount) - Math.abs(a.baseAmount)
    );
  }, [enriched]);

  const total = useMemo(
    () => sorted.reduce((sum, account) => sum + account.baseAmount, 0),
    [sorted]
  );

  const totalAbs = useMemo(
    () => sorted.reduce((sum, account) => sum + Math.abs(account.baseAmount), 0),
    [sorted]
  );

  const largestAccount = sorted[0] || null;
  const largestShare =
    largestAccount && totalAbs > 0
      ? Math.round((Math.abs(largestAccount.baseAmount) / totalAbs) * 100)
      : 0;

  const totalLabel = formatMoneySmart(total, baseCurrency);
  const totalFontSize = totalLabel.length > 18 ? 24 : totalLabel.length > 14 ? 28 : 32;

  return (
    <div
      style={{
        margin: "0 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 22,
          padding: 16,
          border: "1px solid var(--border)",
          background:
            "linear-gradient(145deg, #ffffff 0%, #f7fbff 55%, #f4f8ff 100%)",
          boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -48,
            right: -28,
            width: 152,
            height: 152,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.08)",
            filter: "blur(1px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: -42,
            left: -34,
            width: 128,
            height: 128,
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.08)",
            filter: "blur(1px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              gap: 8,
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: 0.6, fontWeight: 700, color: "#475569" }}>
              ОБЩИЙ БАЛАНС
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#0f172a",
                background: "rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                borderRadius: 999,
                padding: "4px 9px",
              }}
            >
              {baseCurrency}
            </div>
          </div>

          <div
            style={{
              fontSize: totalFontSize,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.1,
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: 10,
            }}
          >
            {totalLabel}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <MetaBadge label="Счетов" value={String(sorted.length)} />
            <MetaBadge
              label="Крупнейший"
              value={largestAccount ? `${largestShare}%` : "—"}
            />
            <MetaBadge
              label="Категория"
              value={largestAccount ? TYPE_LABELS[largestAccount.type] || "Счет" : "—"}
            />
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              height: 10,
              borderRadius: 999,
              overflow: "hidden",
              background: "rgba(148, 163, 184, 0.2)",
            }}
          >
            {sorted.map((account) => {
              const share = totalAbs > 0 ? (Math.abs(account.baseAmount) / totalAbs) * 100 : 0;

              return (
                <div
                  key={account.id}
                  style={{
                    width: `${share}%`,
                    minWidth: share > 0 ? 4 : 0,
                    background: account.uiColor,
                    transition: "width 0.25s ease",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          borderRadius: 18,
          border: "1px solid var(--border)",
          background: "var(--bg)",
          overflow: "hidden",
        }}
      >
        {sorted.length === 0 ? (
          <div
            style={{
              padding: 14,
              fontSize: 13,
              color: "var(--text-secondary)",
              textAlign: "center",
            }}
          >
            Добавьте счет, чтобы увидеть структуру баланса.
          </div>
        ) : (
          sorted.map((account, index) => (
            <div
              key={account.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                padding: "11px 14px",
                borderTop: index === 0 ? "none" : "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: account.uiColor,
                    flexShrink: 0,
                  }}
                />

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {account.name}
                  </div>

                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                    {TYPE_LABELS[account.type] || "Счет"}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right", minWidth: 96 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                  {formatMoneySmart(account.balance, account.currency)}
                </div>

                {account.currency !== baseCurrency && (
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                    ≈ {formatMoney(account.baseAmount, baseCurrency)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const MetaBadge = ({ label, value }) => {
  return (
    <div
      style={{
        height: 26,
        borderRadius: 999,
        padding: "0 10px",
        border: "1px solid rgba(148, 163, 184, 0.35)",
        background: "rgba(255,255,255,0.8)",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
      }}
    >
      <span style={{ color: "#64748b" }}>{label}</span>
      <span style={{ color: "#0f172a", fontWeight: 700 }}>{value}</span>
    </div>
  );
};

export { TotalBalance };
export default TotalBalance;
