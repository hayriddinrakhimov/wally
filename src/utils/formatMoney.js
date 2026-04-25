export const formatMoney = (value, currency = "KZT") => {
  if (value === null || value === undefined) return "0";

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};