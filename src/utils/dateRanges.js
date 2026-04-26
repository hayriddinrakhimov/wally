export const DAY_MS = 24 * 60 * 60 * 1000;

export const PERIOD_OPTIONS = [
  { key: "currentMonth", label: "Месяц" },
  { key: "30d", label: "30д" },
  { key: "90d", label: "90д" },
];

export const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const endOfDay = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
};

const getCurrentMonthRange = (now) => {
  const date = new Date(now);
  const start = new Date(date.getFullYear(), date.getMonth(), 1).getTime();

  return {
    start: startOfDay(start),
    end: endOfDay(now),
  };
};

const getLastDaysRange = (now, days) => {
  const end = endOfDay(now);
  const start = startOfDay(end - (days - 1) * DAY_MS);

  return { start, end };
};

export const getPeriodRange = (periodKey = "currentMonth", now = Date.now()) => {
  const normalizedNow = Number.isFinite(Number(now)) ? Number(now) : Date.now();

  const range =
    periodKey === "30d"
      ? getLastDaysRange(normalizedNow, 30)
      : periodKey === "90d"
      ? getLastDaysRange(normalizedNow, 90)
      : getCurrentMonthRange(normalizedNow);

  const duration = range.end - range.start + 1;
  const previousStart = range.start - duration;
  const previousEnd = range.start - 1;

  return {
    ...range,
    previousStart,
    previousEnd,
  };
};

export const isInRange = (date, start, end) => {
  const value = Number(date);
  return Number.isFinite(value) && value >= start && value <= end;
};

export const formatDateInput = (value) => {
  const date = new Date(Number(value) || Date.now());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDateInput = (value, fallback = Date.now()) => {
  if (typeof value !== "string" || !value.trim()) {
    return startOfDay(fallback);
  }

  const parsed = new Date(`${value}T00:00:00`).getTime();
  if (!Number.isFinite(parsed)) return startOfDay(fallback);

  return startOfDay(parsed);
};
