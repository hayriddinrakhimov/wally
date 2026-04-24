import { createContext, useContext, useEffect, useState } from "react";
import { fetchRates } from "../services/currencyService";

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({
  baseCurrency = "KZT",
  children,
}) => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);

  /* ===== ЗАГРУЗКА КУРСОВ ===== */
  useEffect(() => {
    let isMounted = true;

    const loadRates = async () => {
      setLoading(true);

      try {
        const data = await fetchRates(baseCurrency);

        if (!isMounted) return;

        if (data && Object.keys(data).length) {
          setRates(data);
          localStorage.setItem(
            "rates",
            JSON.stringify(data)
          );
        } else {
          const cached = localStorage.getItem("rates");
          setRates(cached ? JSON.parse(cached) : {});
        }
      } catch (e) {
        console.error("Currency error:", e);

        const cached = localStorage.getItem("rates");
        setRates(cached ? JSON.parse(cached) : {});
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRates();

    return () => {
      isMounted = false;
    };
  }, [baseCurrency]);

  /* ===== КОНВЕРТАЦИЯ ===== */
  const convert = (amount, from, to) => {
    if (!amount) return 0;
    if (from === to) return amount;

    // если курсы не загружены
    if (!rates[from] || !rates[to]) {
      return amount;
    }

    // перевод в базовую валюту
    const amountInBase =
      from === baseCurrency ? amount : amount / rates[from];

    // из базовой в нужную
    const result =
      to === baseCurrency
        ? amountInBase
        : amountInBase * rates[to];

    if (isNaN(result)) return amount;

    return result;
  };

  /* ===== VALUE ===== */
  const value = {
    rates,
    convert,
    loading,
    baseCurrency, // 🔥 теперь доступна везде
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

/* ===== HOOK ===== */
export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error(
      "useCurrency must be used within CurrencyProvider"
    );
  }

  return context;
};