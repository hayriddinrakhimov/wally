import { useMemo, useState } from "react";
import { useCurrency } from "../context/useCurrency";

export const CurrencyPickerContent = () => {
  const { watchlist, addCurrency, removeCurrency, rates } = useCurrency();
  const [query, setQuery] = useState("");

  const allCurrencies = useMemo(() => {
    if (!rates) return [];
    return Object.keys(rates).sort();
  }, [rates]);

  const filtered = useMemo(() => {
    if (!query) return allCurrencies;

    return allCurrencies.filter((currency) =>
      currency.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allCurrencies]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aInWatchlist = watchlist.includes(a);
      const bInWatchlist = watchlist.includes(b);

      if (aInWatchlist && !bInWatchlist) return -1;
      if (!aInWatchlist && bInWatchlist) return 1;

      return a.localeCompare(b);
    });
  }, [filtered, watchlist]);

  return (
    <div style={{ paddingBottom: 20 }}>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Поиск валюты..."
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 12,
          border: "1px solid #eee",
          outline: "none",
          marginBottom: 12,
        }}
      />

      {sorted.length === 0 ? (
        <div style={{ opacity: 0.6 }}>Нет валют</div>
      ) : (
        sorted.map((currency) => {
          const active = watchlist.includes(currency);

          return (
            <div
              key={currency}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #f3f3f3",
              }}
            >
              <div style={{ fontWeight: 600 }}>{currency}</div>

              <button
                onClick={() =>
                  active
                    ? removeCurrency(currency)
                    : addCurrency(currency)
                }
                style={{
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: 10,
                  fontSize: 12,
                  cursor: "pointer",
                  background: active ? "#ef4444" : "var(--primary)",
                  color: "white",
                }}
              >
                {active ? "Удалить" : "Добавить"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};