import { useCurrency } from "../context/useCurrency";

const PRIORITY = ["USD", "EUR", "RUB"];

export const CurrencyWidget = ({ onOpen }) => {
  const { watchlist, convert, baseCurrency, loading, prevRates, rates } =
    useCurrency();

  const sorted = [...(watchlist || [])]
    .filter((currency) => currency !== baseCurrency)
    .sort((a, b) => {
      const ai = PRIORITY.indexOf(a);
      const bi = PRIORITY.indexOf(b);

      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;

      return ai - bi;
    })
    .slice(0, 4);

  const getTrend = (currency) => {
    const now = rates[currency];
    const prev = prevRates?.[currency];

    if (!now || !prev) return null;
    if (now > prev) return "up";
    if (now < prev) return "down";
    return "flat";
  };

  const format = (currency) => {
    const value = convert(1, currency, baseCurrency);
    if (!Number.isFinite(value)) return "—";
    return value < 1 ? value.toFixed(4) : value.toFixed(2);
  };

  return (
    <div
      style={{
        margin: "8px 16px",
        padding: 14,
        borderRadius: 16,
        background: "white",
        border: "1px solid #eee",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Финансовая погода</div>
          <div style={{ fontSize: 12, opacity: 0.65 }}>
            Курс к {baseCurrency}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          style={{
            border: "none",
            background: "var(--primary)",
            color: "white",
            padding: "6px 10px",
            borderRadius: 10,
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Изменить
        </button>
      </div>

      {loading && (
        <div style={{ fontSize: 13, opacity: 0.65 }}>Обновление курсов...</div>
      )}

      {!loading && sorted.length === 0 && (
        <div style={{ fontSize: 13, opacity: 0.65 }}>Нет валют для отображения</div>
      )}

      {!loading &&
        sorted.map((currency) => {
          const trend = getTrend(currency);

          return (
            <div
              key={currency}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {currency}
                {trend === "up" && <span style={{ marginLeft: 6 }}>↑</span>}
                {trend === "down" && <span style={{ marginLeft: 6 }}>↓</span>}
              </div>

              <div>
                1 {currency} = {format(currency)} {baseCurrency}
              </div>
            </div>
          );
        })}
    </div>
  );
};