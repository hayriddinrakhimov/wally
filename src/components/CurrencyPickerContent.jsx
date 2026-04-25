import { useState, useMemo } from "react";
import { useCurrency } from "../context/CurrencyProvider";

export const CurrencyPickerContent = () => {
  const { watchlist, addCurrency, removeCurrency, rates } =
    useCurrency();

  const [query, setQuery] = useState("");

  /* ===== ВСЕ ВАЛЮТЫ ИЗ API ===== */
  const allCurrencies = useMemo(() => {
    if (!rates) return [];

    return Object.keys(rates).sort();
  }, [rates]);

  /* ===== ФИЛЬТР ПО ПОИСКУ ===== */
  const filtered = useMemo(() => {
    if (!query) return allCurrencies;

    return allCurrencies.filter((c) =>
      c.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allCurrencies]);

  /* ===== СОРТИРОВКА: избранные сверху ===== */
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aFav = watchlist.includes(a);
      const bFav = watchlist.includes(b);

      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      return a.localeCompare(b);
    });
  }, [filtered, watchlist]);

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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

      {/* LIST */}
      {sorted.length === 0 ? (
        <div style={{ opacity: 0.6 }}>Нет валют</div>
      ) : (
        sorted.map((cur) => {
          const active = watchlist.includes(cur);

          return (
            <div
              key={cur}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #f3f3f3",
              }}
            >
              <div style={{ fontWeight: 600 }}>{cur}</div>

              <button
                onClick={() =>
                  active
                    ? removeCurrency(cur)
                    : addCurrency(cur)
                }
                style={{
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: 10,
                  fontSize: 12,
                  cursor: "pointer",
                  background: active
                    ? "#ef4444"
                    : "var(--primary)",
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