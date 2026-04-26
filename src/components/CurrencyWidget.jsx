import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, Minus, SlidersHorizontal } from "lucide-react";
import { useCurrency } from "../context/useCurrency";
import { formatMoney } from "../utils/formatMoney";

const PRIORITY = ["USD", "EUR", "RUB", "KZT"];

const sortCurrencies = (list) =>
  [...new Set(list)].sort((a, b) => {
    const ai = PRIORITY.indexOf(a);
    const bi = PRIORITY.indexOf(b);

    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;

    return ai - bi;
  });

const getBankRate = (rate, side) => {
  if (!Number.isFinite(rate) || rate <= 0) return NaN;
  const spread = rate * 0.005;
  return side === "buy" ? Math.max(0, rate - spread) : rate + spread;
};

export const CurrencyWidget = ({ onOpen }) => {
  const { watchlist, convert, baseCurrency, loading, prevRates, rates } = useCurrency();

  const trackedCurrencies = useMemo(
    () => sortCurrencies((watchlist || []).filter((currency) => currency !== baseCurrency)),
    [watchlist, baseCurrency]
  );

  const getTrend = (currency) => {
    const now = rates[currency];
    const prev = prevRates?.[currency];

    if (!Number.isFinite(now) || !Number.isFinite(prev)) return "flat";
    if (now > prev) return "up";
    if (now < prev) return "down";
    return "flat";
  };

  const formatRate = (value) => {
    if (!Number.isFinite(value) || value <= 0) return "-";

    return formatMoney(value, baseCurrency, {
      maximumFractionDigits: value < 1 ? 4 : 2,
      minimumFractionDigits: value < 1 ? 2 : 0,
    });
  };

  return (
    <div
      style={{
        margin: "8px 16px",
        padding: 14,
        borderRadius: 16,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Курс валют</div>
          <div style={{ fontSize: 12, opacity: 0.65 }}>База: {baseCurrency}</div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          title="Управление валютами"
          aria-label="Управление валютами"
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: "1px solid var(--primary)",
            background: "transparent",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          padding: "0 2px 6px",
          fontSize: 11,
          color: "var(--text-secondary)",
        }}
      >
        <span>Валюта</span>
        <span style={{ textAlign: "right" }}>Покупка</span>
        <span style={{ textAlign: "right" }}>Продажа</span>
      </div>

      {loading && <div style={{ fontSize: 12, opacity: 0.65 }}>Обновление курсов...</div>}

      {!loading && trackedCurrencies.length === 0 && (
        <div style={{ fontSize: 12, opacity: 0.65 }}>Добавьте валюты в настройках валют.</div>
      )}

      {!loading &&
        trackedCurrencies.map((currency) => {
          const midRate = convert(1, currency, baseCurrency);
          const buyRate = getBankRate(midRate, "buy");
          const sellRate = getBankRate(midRate, "sell");

          const trend = getTrend(currency);
          const TrendIcon =
            trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
          const trendColor =
            trend === "up"
              ? "#16a34a"
              : trend === "down"
              ? "#dc2626"
              : "var(--text-secondary)";

          return (
            <div
              key={currency}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                alignItems: "center",
                padding: "7px 2px",
                borderTop: "1px solid rgba(148, 163, 184, 0.16)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontWeight: 600,
                }}
              >
                <span>{currency}</span>
                <TrendIcon size={13} color={trendColor} />
              </div>

              <div style={{ textAlign: "right", fontSize: 12 }}>{formatRate(buyRate)}</div>

              <div style={{ textAlign: "right", fontSize: 12, fontWeight: 700 }}>
                {formatRate(sellRate)}
              </div>
            </div>
          );
        })}
    </div>
  );
};
