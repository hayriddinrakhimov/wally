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

const formatCompactNumberFallback = (amount) => {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    const value = abs / 1_000_000_000;
    return `${sign}${new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 1,
    }).format(value)} млрд`;
  }

  if (abs >= 1_000_000) {
    const value = abs / 1_000_000;
    return `${sign}${new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 1,
    }).format(value)} млн`;
  }

  if (abs >= 1_000) {
    const value = abs / 1_000;
    return `${sign}${new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 1,
    }).format(value)} тыс`;
  }

  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(amount);
};

export const formatMoney = (value, currency = "KZT", options = {}) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "0";

  const normalizedCurrency = normalizeCurrency(currency);
  const compact = Boolean(options?.compact);
  const maximumFractionDigits = Number.isFinite(Number(options?.maximumFractionDigits))
    ? Number(options.maximumFractionDigits)
    : compact
    ? 1
    : 0;
  const minimumFractionDigits = Number.isFinite(Number(options?.minimumFractionDigits))
    ? Number(options.minimumFractionDigits)
    : 0;

  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: normalizedCurrency,
      notation: compact ? "compact" : "standard",
      compactDisplay: "short",
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch {
    const number = compact
      ? formatCompactNumberFallback(amount)
      : new Intl.NumberFormat("ru-RU", {
          minimumFractionDigits,
          maximumFractionDigits,
        }).format(amount);

    const symbol = CURRENCY_SYMBOLS[normalizedCurrency] || normalizedCurrency;

    return `${number} ${symbol}`;
  }
};

export const formatMoneySmart = (value, currency = "KZT") => {
  const amount = Number(value);
  const compact = Number.isFinite(amount) && Math.abs(amount) >= 1_000_000;

  return formatMoney(value, currency, {
    compact,
    maximumFractionDigits: compact ? 1 : 0,
  });
};
