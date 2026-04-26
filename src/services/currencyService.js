const BASE_URL = "https://open.er-api.com/v6/latest";

const USD_FALLBACK = {
  USD: 1,
  EUR: 0.9,
  RUB: 95,
  KZT: 470,
  UZS: 12800,
  KGS: 89,
};

const buildFallbackRates = (base = "USD") => {
  const normalizedBase = String(base || "USD").toUpperCase();
  const baseRate = USD_FALLBACK[normalizedBase] || USD_FALLBACK.USD;

  const converted = {};
  Object.entries(USD_FALLBACK).forEach(([code, rate]) => {
    converted[code] = rate / baseRate;
  });

  converted[normalizedBase] = 1;
  return converted;
};

export const fetchRates = async (base = "USD") => {
  try {
    const res = await fetch(`${BASE_URL}/${base}`);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

    if (data.result !== "success") {
      throw new Error("API returned error result");
    }

    return {
      base: data.base_code,
      rates: data.rates,
      time: data.time_last_update_utc,
    };
  } catch (error) {
    console.error("Currency API error:", error);

    return {
      base,
      rates: buildFallbackRates(base),
      time: null,
    };
  }
};
