const currencyLocales = {
  KZT: "ru-KZ",
  USD: "en-US",
  EUR: "de-DE",
  RUB: "ru-RU",
};

export const formatMoney = (amount, currency) => {
  try {
    const safeAmount =
      typeof amount === "number" && !isNaN(amount)
        ? amount
        : 0;

    const locale = currencyLocales[currency];

    if (!locale) {
      return `${Math.round(safeAmount).toLocaleString()} ${currency}`;
    }

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(safeAmount);
  } catch {
    return `${Math.round(amount || 0).toLocaleString()} ${currency}`;
  }
};