import { useState } from "react";
import { useCurrency } from "../context/useCurrency";

const ALL_CURRENCIES = [
  "USD",
  "EUR",
  "RUB",
  "CNY",
  "GBP",
  "JPY",
  "KZT",
  "UZS",
];

export const ExchangeRatesContent = () => {
  const {
    rates,
    watchlist,
    addCurrency,
    removeCurrency,
    baseCurrency,
    loading,
  } = useCurrency();

  const [search, setSearch] = useState("");

  const filtered = ALL_CURRENCIES.filter((currency) =>
    currency.toLowerCase().includes(search.toLowerCase())
  );

  const isInWatchlist = (currency) => watchlist?.includes(currency);

  const formatRate = (currency) => {
    if (!rates[currency]) return "—";
    const value = rates[currency];
    if (typeof value !== "number") return "—";
    return value.toFixed(2);
  };

  return (
    <div>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Поиск валюты..."
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 12,
          border: "1px solid #eee",
          marginBottom: 12,
          outline: "none",
        }}
      />

      {loading && <div style={{ fontSize: 13, opacity: 0.6 }}>Загрузка курсов...</div>}

      {!loading &&
        filtered.map((currency) => {
          const added = isInWatchlist(currency);

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
              <div>
                <div style={{ fontWeight: 600 }}>{currency}</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  {formatRate(currency)} {baseCurrency}
                </div>
              </div>

              {!added ? (
                <button
                  onClick={() => addCurrency(currency)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: "none",
                    background: "var(--primary)",
                    color: "white",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Добавить
                </button>
              ) : (
                <button
                  onClick={() => removeCurrency(currency)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "transparent",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Убрать
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
};