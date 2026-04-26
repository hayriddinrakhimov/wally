const BASE_URL = "https://open.er-api.com/v6/latest";

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

    // fallback чтобы приложение НЕ падало
    return {
      base,
      rates: {
        USD: 1,
        EUR: 0.9,
        RUB: 95,
        KZT: 470,
      },
      time: null,
    };
  }
};