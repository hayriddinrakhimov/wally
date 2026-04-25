import { useCurrency } from "../context/CurrencyProvider";

const PRIORITY = ["USD", "EUR", "RUB"];

export const CurrencyWidget = ({ onOpen }) => {
  const {
    watchlist,
    convert,
    baseCurrency,
    loading,
    prevRates,
    rates,
  } = useCurrency();

  /* ===================== сортировка ===================== */
  const sorted = [...(watchlist || [])].sort((a, b) => {
    const ai = PRIORITY.indexOf(a);
    const bi = PRIORITY.indexOf(b);

    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;

    return ai - bi;
  });

  /* ===================== тренд ===================== */
  const getTrend = (cur) => {
    const now = rates[cur];
    const prev = prevRates?.[cur];

    if (!now || !prev) return null;

    if (now > prev) return "up";
    if (now < prev) return "down";
    return "flat";
  };

  /* ===================== формат ===================== */
  const format = (cur) => {
    const value = convert(1, cur, baseCurrency);

    if (!value || isNaN(value)) return "—";

    // 🔥 умное округление
    return value < 1 ? value.toFixed(4) : value.toFixed(1);
  };

  return (
    <div
      style={{
        margin: "12px 16px",
        padding: 16,
        borderRadius: 16,
        background: "white",
        border: "1px solid #eee",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 600 }}>Курсы валют</div>

        <button
          onClick={onOpen}
          style={{
            border: "none",
            background: "var(--primary)",
            color: "white",
            padding: "6px 10px",
            borderRadius: 10,
            fontSize: 12,
          }}
        >
          Изменить
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div style={{ fontSize: 13, opacity: 0.6 }}>
          Обновление...
        </div>
      )}

      {/* LIST */}
      {!loading &&
        sorted.map((c) => {
          const trend = getTrend(c);

          return (
            <div
              key={c}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
              {/* LEFT */}
              <div style={{ fontWeight: 600 }}>
                {c}{" "}
                {trend === "up" && "📈"}
                {trend === "down" && "📉"}
              </div>

              {/* RIGHT */}
              <div>
                1 {c} = {format(c)} {baseCurrency}
              </div>
            </div>
          );
        })}
    </div>
  );
};