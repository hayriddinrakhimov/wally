export const DAY_MS = 24 * 60 * 60 * 1000;

// Backward-compat export for stale HMR modules that still import PERIOD_OPTIONS.
// UI now uses manual calendar range selection.
export const PERIOD_OPTIONS = [{ key: "currentMonth", label: "Месяц" }];

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

export const getCurrentMonthRange = (now = Date.now()) => {
  const date = new Date(now);
  const start = new Date(date.getFullYear(), date.getMonth(), 1).getTime();

  return {
    start: startOfDay(start),
    end: endOfDay(now),
  };
};

export const getPreviousRange = (start, end) => {
  const normalizedStart = startOfDay(start);
  const normalizedEnd = endOfDay(end);
  const duration = normalizedEnd - normalizedStart + 1;

  return {
    previousStart: normalizedStart - duration,
    previousEnd: normalizedStart - 1,
  };
};

export const getRangeWithPrevious = (start, end) => {
  const normalizedStart = startOfDay(start);
  const normalizedEnd = endOfDay(end);
  const previous = getPreviousRange(normalizedStart, normalizedEnd);

  return {
    start: normalizedStart,
    end: normalizedEnd,
    ...previous,
  };
};

export const getPeriodRange = (periodKey = "currentMonth", now = Date.now()) => {
  // Kept for backward compatibility with existing callsites.
  if (periodKey === "currentMonth") {
    const range = getCurrentMonthRange(now);
    return getRangeWithPrevious(range.start, range.end);
  }

  const days = periodKey === "90d" ? 90 : 30;
  const normalizedNow = Number.isFinite(Number(now)) ? Number(now) : Date.now();
  const end = endOfDay(normalizedNow);
  const start = startOfDay(end - (days - 1) * DAY_MS);

  return getRangeWithPrevious(start, end);
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
