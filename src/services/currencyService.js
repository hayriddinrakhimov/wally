const BASE_URL = "https://open.er-api.com/v6/latest";

export const fetchRates = async (base = "KZT") => {
  try {
    const res = await fetch(`${BASE_URL}/${base}`);
    const data = await res.json();

    if (data.result !== "success") {
      throw new Error("API error");
    }

    return data.rates;
  } catch (e) {
    console.error("Currency API error:", e);
    return null;
  }
};