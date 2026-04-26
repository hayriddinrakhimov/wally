const BASE_URL = "https://api.frankfurter.app/latest";

const normalizeCurrencyCode = (value) => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  return normalized.length === 3 ? normalized : "KZT";
};

export const fetchRates = async (base = "KZT") => {
  const normalizedBase = normalizeCurrencyCode(base);

  try {
    const response = await fetch(
      `${BASE_URL}?from=${encodeURIComponent(normalizedBase)}`
    );
    const data = await response.json();

    if (!response.ok || !data?.rates) {
      throw new Error(`Currency API error for base ${normalizedBase}`);
    }

    return {
      ...data.rates,
      [normalizedBase]: 1,
    };
  } catch (error) {
    console.error("Currency API error:", error);
    return null;
  }
};