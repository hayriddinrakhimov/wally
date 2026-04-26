const FALLBACK_CURRENCY = "USD";

const CURRENCY_SYMBOLS = {
  KZT: "₸",
  USD: "$",
  EUR: "€",
  RUB: "₽",
};

const normalizeCurrency = (currency) => {
  const normalized = String(currency || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  return /^[A-Z]{3}$/.test(normalized)
    ? normalized
    : FALLBACK_CURRENCY;
};

export const formatMoney = (value, currency = "KZT") => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "0";

  const normalizedCurrency = normalizeCurrency(currency);

  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    const number = new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 0,
    }).format(amount);

    const symbol =
      CURRENCY_SYMBOLS[normalizedCurrency] || normalizedCurrency;

    return `${number} ${symbol}`;
  }
};
