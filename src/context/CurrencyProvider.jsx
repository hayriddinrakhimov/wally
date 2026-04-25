import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchRates } from "../services/currencyService";

const CurrencyContext = createContext(null);

/* ===================== НОРМАЛИЗАЦИЯ ===================== */
const normalizeRates = (data) => {
  if (!data) return {};

  const flat = {};

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "number") {
      flat[key] = value;
    }

    if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([k, v]) => {
        if (typeof v === "number") {
          flat[k] = v;
        }
      });
    }
  });

  return flat;
};

export const CurrencyProvider = ({
  baseCurrency = "KZT",
  children,
}) => {
  const [rates, setRates] = useState({});
  const [prevRates, setPrevRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [watchlist, setWatchlist] = useState([
    "USD",
    "EUR",
    "RUB",
  ]);

  const [internalBaseCurrency, setInternalBaseCurrency] =
    useState(baseCurrency);

  const STORAGE_KEY = "rates_v2";
  const WATCHLIST_KEY = "currency_watchlist";

  /* ===================== SYNC PROP ===================== */
  useEffect(() => {
    setInternalBaseCurrency(baseCurrency);
  }, [baseCurrency]);

  /* ===================== CACHE ===================== */
  const loadFromCache = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;

      const parsed = JSON.parse(raw);

      const isFresh =
        Date.now() - parsed.timestamp < 1000 * 60 * 60;

      if (isFresh && parsed.rates) {
        const normalized = normalizeRates(parsed.rates);

        setRates(normalized);
        setLastUpdated(parsed.timestamp);

        return true;
      }

      return false;
    } catch (e) {
      console.error("Cache error:", e);
      return false;
    }
  };

  /* ===================== LOAD ===================== */
  const loadRates = async (force = false) => {
    setLoading(true);

    try {
      if (!force) {
        const hasCache = loadFromCache();
        if (hasCache) {
          setLoading(false);
          return;
        }
      }

      const data = await fetchRates("USD"); // 🔥 фиксированная база
      const normalized = normalizeRates(data);

      if (Object.keys(normalized).length) {
        setPrevRates(rates);
        setRates(normalized);

        const timestamp = Date.now();
        setLastUpdated(timestamp);

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            rates: normalized,
            timestamp,
          })
        );
      } else {
        throw new Error("Empty rates");
      }
    } catch (e) {
      console.error("Currency error:", e);

      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const normalized = normalizeRates(parsed.rates);

        setPrevRates(rates);
        setRates(normalized);
        setLastUpdated(parsed.timestamp || null);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===================== INIT (🔥 FIX) ===================== */
  useEffect(() => {
    loadRates();
  }, []);

  /* ===================== WATCHLIST ===================== */
  useEffect(() => {
    const saved = localStorage.getItem(WATCHLIST_KEY);

    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error("Watchlist error:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      WATCHLIST_KEY,
      JSON.stringify(watchlist)
    );
  }, [watchlist]);

  /* ===================== ACTIONS ===================== */
  const refreshRates = () => loadRates(true);

  const addCurrency = (code) => {
    setWatchlist((prev) =>
      prev.includes(code) ? prev : [...prev, code]
    );
  };

  const removeCurrency = (code) => {
    setWatchlist((prev) =>
      prev.filter((c) => c !== code)
    );
  };

  /* ===================== CONVERT (🔥 FIXED) ===================== */
  const convert = useCallback(
    (amount, from, to) => {
      if (!amount) return 0;
      if (from === to) return amount;

      if (!rates[from] || !rates[to]) return amount;

      const base =
        from === internalBaseCurrency
          ? amount
          : amount / rates[from];

      return to === internalBaseCurrency
        ? base
        : base * rates[to];
    },
    [rates, internalBaseCurrency]
  );

  return (
    <CurrencyContext.Provider
      value={{
        rates,
        prevRates,
        convert,
        loading,

        baseCurrency: internalBaseCurrency,
        setBaseCurrency: setInternalBaseCurrency,

        lastUpdated,
        refreshRates,

        watchlist,
        addCurrency,
        removeCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

/* ===================== HOOK ===================== */
export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);

  if (!ctx) {
    throw new Error(
      "useCurrency must be used within CurrencyProvider"
    );
  }

  return ctx;
};