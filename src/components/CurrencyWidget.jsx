import { useMemo, useState } from "react";
import { useCurrency } from "../context/useCurrency";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { formatMoney } from "../utils/formatMoney";

const PRIORITY = ["USD", "EUR", "RUB"];

const PAGE_SIZE = 4;

export const CurrencyWidget = ({ onOpen }) => {
  const { watchlist, convert, baseCurrency, loading, prevRates, rates } =
    useCurrency();

  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    return [...(watchlist || [])]
      .filter((currency) => currency !== baseCurrency)
      .sort((a, b) => {
        const ai = PRIORITY.indexOf(a);
        const bi = PRIORITY.indexOf(b);

        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;

        return ai - bi;
      });
  }, [watchlist, baseCurrency]);

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  const visible = useMemo(() => {
    const start = page * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

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
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            Курс валют
          </div>
          <div style={{ fontSize: 12, opacity: 0.65 }}>
            База: {baseCurrency}
          </div>
        </div>

        {/* как кнопка "+" у счетов */}
        <button
          onClick={onOpen}
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
          <Plus size={18} />
        </button>
      </div>

      {/* BODY */}
      {loading && (
        <div style={{ fontSize: 13, opacity: 0.65 }}>
          Обновление курсов...
        </div>
      )}

      {!loading && visible.length === 0 && (
        <div style={{ fontSize: 13, opacity: 0.65 }}>
          Нет валют для отображения
        </div>
      )}

      {!loading &&
        visible.map((currency) => {
          const trend = getTrend(currency);
          const trendColor =
            trend === "up" ? "#16a34a" : trend === "down" ? "#dc2626" : "var(--text-secondary)";

          return (
            <div
              key={currency}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                padding: "6px 0",
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                {currency}
                {trend === "up" && <span style={{ marginLeft: 6, color: trendColor }}>↑</span>}
                {trend === "down" && <span style={{ marginLeft: 6, color: trendColor }}>↓</span>}
              </div>

              <div
                style={{
                  minWidth: 0,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                1 {currency} = {format(currency)}
              </div>
            </div>
          );
        })}

      {/* PAGINATION */}
      {pages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <div style={{ fontSize: 12, opacity: 0.6 }}>
            {page + 1} / {pages}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
