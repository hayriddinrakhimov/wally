import { createContext, useContext, useEffect, useState } from "react";
import { fetchRates } from "../services/currencyService";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ baseCurrency, children }) => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRates = async () => {
      try {
        const data = await fetchRates(baseCurrency);

        if (!isMounted) return;

        if (data) {
          setRates(data);
          localStorage.setItem("rates", JSON.stringify(data));
        } else {
          const cached = localStorage.getItem("rates");
          setRates(cached ? JSON.parse(cached) : {});
        }
      } catch (e) {
        console.error("Currency error:", e);
        setRates({});
      }
    };

    loadRates();

    return () => {
      isMounted = false;
    };
  }, [baseCurrency]);

  const convert = (amount, from, to) => {
    if (!amount) return 0;

    if (!rates[from] || !rates[to]) {
      return amount; // fallback без краша
    }

    const amountInBase =
      from === baseCurrency ? amount : amount / rates[from];

    const result =
      to === baseCurrency
        ? amountInBase
        : amountInBase * rates[to];

    // 🔥 защита от NaN
    if (isNaN(result)) return amount;

    return result;
  };

  return (
    <CurrencyContext.Provider value={{ rates, convert, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);