import { useCallback, useEffect, useMemo, useState } from "react";
import { CurrencyContext } from "./CurrencyContext";
import { fetchRates } from "../services/currencyService";

const RATES_TTL_MS = 1000 * 60 * 60;
const WATCHLIST_KEY = "currency_watchlist";
const BASE_CURRENCY_KEY = "baseCurrency";

const normalizeCurrencyCode = (value, fallback = "KZT") => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  return normalized.length === 3 ? normalized : fallback;
};

const parseStoredCurrency = (raw) => {
  if (!raw) return "KZT";

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") {
      return normalizeCurrencyCode(parsed);
    }
  } catch {
    // no-op
  }

  return normalizeCurrencyCode(raw);
};

const normalizeRates = (data) => {
  if (!data) return {};

  const flat = {};

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "number") {
      flat[key] = value;
    }

    if (value && typeof value === "object") {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (typeof nestedValue === "number") {
          flat[nestedKey] = nestedValue;
        }
      });
    }
  });

  return flat;
};

const getRatesCacheKey = (baseCurrency) => `rates_v3_${baseCurrency}`;

const readJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const CurrencyProvider = ({ children }) => {
  const [baseCurrency, setBaseCurrencyState] = useState(() =>
    parseStoredCurrency(localStorage.getItem(BASE_CURRENCY_KEY))
  );

  const [rates, setRates] = useState({});
  const [prevRates, setPrevRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [watchlist, setWatchlist] = useState(() => {
    const stored = readJson(WATCHLIST_KEY);

    if (!Array.isArray(stored) || stored.length === 0) {
      return ["USD", "EUR", "RUB"];
    }

    return stored
      .map((item) => normalizeCurrencyCode(item, ""))
      .filter(Boolean);
  });

  useEffect(() => {
    localStorage.setItem(BASE_CURRENCY_KEY, baseCurrency);
  }, [baseCurrency]);

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const loadRates = useCallback(
    async (force = false) => {
      const cacheKey = getRatesCacheKey(baseCurrency);
      setLoading(true);

      try {
        if (!force) {
          const cached = readJson(cacheKey);
          const isFresh =
            cached?.timestamp && Date.now() - cached.timestamp < RATES_TTL_MS;

          if (isFresh && cached?.rates) {
            const normalized = normalizeRates(cached.rates);
            setRates(normalized);
            setLastUpdated(cached.timestamp);
            setLoading(false);
            return;
          }
        }

        const data = await fetchRates(baseCurrency);
        const normalized = normalizeRates(data);

        if (!Object.keys(normalized).length) {
          throw new Error("Empty rates");
        }

        setRates((currentRates) => {
          setPrevRates(currentRates);
          return normalized;
        });

        const timestamp = Date.now();
        setLastUpdated(timestamp);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({ rates: normalized, timestamp })
        );
      } catch {
        const cached = readJson(cacheKey);

        if (cached?.rates) {
          const normalized = normalizeRates(cached.rates);
          setRates((currentRates) => {
            setPrevRates(currentRates);
            return normalized;
          });
          setLastUpdated(cached.timestamp || null);
        }
      } finally {
        setLoading(false);
      }
    },
    [baseCurrency]
  );

  useEffect(() => {
    loadRates(false);
  }, [loadRates]);

  const refreshRates = useCallback(() => loadRates(true), [loadRates]);

  const setBaseCurrency = useCallback((nextCurrency) => {
    const normalized = normalizeCurrencyCode(nextCurrency, "");

    if (normalized) {
      setBaseCurrencyState(normalized);
    }
  }, []);

  const addCurrency = useCallback((code) => {
    const normalized = normalizeCurrencyCode(code, "");

    if (!normalized) return;

    setWatchlist((prev) =>
      prev.includes(normalized) ? prev : [...prev, normalized]
    );
  }, []);

  const removeCurrency = useCallback((code) => {
    const normalized = normalizeCurrencyCode(code, "");

    setWatchlist((prev) => prev.filter((item) => item !== normalized));
  }, []);

  const convert = useCallback(
    (amount, from, to) => {
      const value = Number(amount);
      if (!Number.isFinite(value)) return 0;

      const source = normalizeCurrencyCode(from, baseCurrency);
      const target = normalizeCurrencyCode(to, baseCurrency);

      if (source === target) return value;
      if (!rates[source] || !rates[target]) return value;

      const baseAmount =
        source === baseCurrency ? value : value / rates[source];

      return target === baseCurrency
        ? baseAmount
        : baseAmount * rates[target];
    },
    [rates, baseCurrency]
  );

  const value = useMemo(
    () => ({
      rates,
      prevRates,
      convert,
      loading,
      baseCurrency,
      setBaseCurrency,
      lastUpdated,
      refreshRates,
      watchlist,
      addCurrency,
      removeCurrency,
    }),
    [
      rates,
      prevRates,
      convert,
      loading,
      baseCurrency,
      setBaseCurrency,
      lastUpdated,
      refreshRates,
      watchlist,
      addCurrency,
      removeCurrency,
    ]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};