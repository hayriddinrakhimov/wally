import { useMemo, useState } from "react";
import { Plus, RefreshCw, X } from "lucide-react";
import { useCurrency } from "../context/useCurrency";

const PRIORITY = ["USD", "EUR", "RUB", "KZT"];

const ALL_CURRENCIES = [
  "USD",
  "EUR",
  "RUB",
  "KZT",
  "KGS",
  "UZS",
  "CNY",
  "GBP",
  "TRY",
  "AED",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "SEK",
  "NOK",
];

const normalizeCurrencyCode = (value, fallback = "") => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  return normalized.length === 3 ? normalized : fallback;
};

const sortCurrencies = (list) =>
  [...new Set(list)].sort((a, b) => {
    const ai = PRIORITY.indexOf(a);
    const bi = PRIORITY.indexOf(b);

    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;

    return ai - bi;
  });

export const CurrencyPickerContent = () => {
  const {
    watchlist,
    baseCurrency,
    setBaseCurrency,
    addCurrency,
    removeCurrency,
    rates,
    refreshRates,
    loading,
  } = useCurrency();
  const [query, setQuery] = useState("");

  const allCurrencies = useMemo(
    () =>
      sortCurrencies([
        ...ALL_CURRENCIES,
        ...(watchlist || []),
        ...Object.keys(rates || {}),
        baseCurrency,
      ]),
    [watchlist, rates, baseCurrency]
  );

  const trackedCurrencies = useMemo(
    () =>
      sortCurrencies((watchlist || []).filter((currency) => currency !== baseCurrency)),
    [watchlist, baseCurrency]
  );

  const search = String(query || "")
    .trim()
    .toUpperCase();

  const availableToAdd = useMemo(() => {
    if (!search) return [];

    return allCurrencies
      .filter(
        (currency) =>
          currency.includes(search) &&
          currency !== baseCurrency &&
          !trackedCurrencies.includes(currency)
      )
      .slice(0, 8);
  }, [search, allCurrencies, trackedCurrencies, baseCurrency]);

  const handleAddCurrency = (rawCode) => {
    const normalized = normalizeCurrencyCode(rawCode);
    if (!normalized || normalized === baseCurrency) return;

    addCurrency(normalized);
    setQuery("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Этот список используется во всех формах приложения.
        </div>

        <button
          type="button"
          onClick={refreshRates}
          title="Обновить курсы"
          aria-label="Обновить курсы"
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <Field label="Основная валюта">
        <select
          value={baseCurrency}
          onChange={(event) => setBaseCurrency(event.target.value)}
          style={inputStyle}
        >
          {allCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Отслеживаемые валюты">
        {trackedCurrencies.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {trackedCurrencies.map((currency) => (
              <button
                key={currency}
                type="button"
                onClick={() => removeCurrency(currency)}
                style={chipStyle}
              >
                {currency}
                <X size={12} />
              </button>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Пока ничего не выбрано.
          </div>
        )}
      </Field>

      <Field label="Добавить валюту">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 8,
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddCurrency(query);
              }
            }}
            placeholder="Код валюты (USD)"
            maxLength={3}
            style={inputStyle}
          />

          <button
            type="button"
            onClick={() => handleAddCurrency(query)}
            style={addButtonStyle}
          >
            <Plus size={16} />
          </button>
        </div>

        {availableToAdd.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {availableToAdd.map((currency) => (
              <button
                key={currency}
                type="button"
                onClick={() => handleAddCurrency(currency)}
                style={suggestionStyle}
              >
                + {currency}
              </button>
            ))}
          </div>
        )}
      </Field>

      {loading && (
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Обновление курсов...</div>
      )}
    </div>
  );
};

const Field = ({ label, children }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
    <span style={{ color: "var(--text-secondary)" }}>{label}</span>
    {children}
  </label>
);

const inputStyle = {
  width: "100%",
  height: 38,
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--text)",
  padding: "0 10px",
  outline: "none",
  fontSize: 14,
};

const chipStyle = {
  height: 30,
  borderRadius: 999,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--text)",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "0 10px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
};

const addButtonStyle = {
  height: 38,
  minWidth: 38,
  borderRadius: 10,
  border: "1px solid var(--primary)",
  background: "transparent",
  color: "var(--primary)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const suggestionStyle = {
  border: "1px dashed var(--border)",
  background: "transparent",
  color: "var(--text-secondary)",
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
};
