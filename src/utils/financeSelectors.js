import { DAY_MS, endOfDay, isInRange, startOfDay } from "./dateRanges";

const CATEGORY_NAMES = {
  food: "Еда",
  salary: "Зарплата",
  transport: "Транспорт",
  transfer: "Перевод",
  uncategorized: "Без категории",
};

export const CYCLE_OPTIONS = [
  { key: "week", label: "Каждую неделю" },
  { key: "month", label: "Каждый месяц" },
  { key: "year", label: "Каждый год" },
];

export const GOAL_FREQUENCY_OPTIONS = [
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
];

export const getCategoryLabel = (transaction) => {
  const id = transaction?.categoryId || transaction?.category || "";
  if (!id) return "Без категории";

  return CATEGORY_NAMES[id] || id;
};

export const filterTransactionsByRange = (transactions, start, end) => {
  if (!Array.isArray(transactions)) return [];

  return transactions.filter((tx) => isInRange(tx?.date, start, end));
};

export const toBaseAmount = (transaction, convert, baseCurrency) => {
  const amount = Number(transaction?.amount);
  if (!Number.isFinite(amount) || amount <= 0) return 0;

  const converted = convert(
    amount,
    transaction?.currency || baseCurrency,
    baseCurrency
  );

  return Number.isFinite(converted) ? converted : 0;
};

export const getKpiTotals = (transactions, convert, baseCurrency) => {
  return transactions.reduce(
    (acc, tx) => {
      const amount = toBaseAmount(tx, convert, baseCurrency);
      if (!amount) return acc;

      if (tx.type === "income") {
        acc.income += amount;
      } else if (tx.type === "expense") {
        acc.expense += amount;
      }

      acc.net = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, net: 0 }
  );
};

export const getExpenseByCategory = (transactions, convert, baseCurrency) => {
  const map = new Map();

  transactions.forEach((tx) => {
    if (tx.type !== "expense") return;

    const value = toBaseAmount(tx, convert, baseCurrency);
    if (!value) return;

    const key = tx.categoryId || "uncategorized";
    map.set(key, (map.get(key) || 0) + value);
  });

  return Array.from(map.entries())
    .map(([id, value]) => ({
      id,
      label: CATEGORY_NAMES[id] || id,
      value,
    }))
    .sort((a, b) => b.value - a.value);
};

export const getCategoryComparison = (
  currentTransactions,
  previousTransactions,
  convert,
  baseCurrency
) => {
  const currentMap = new Map();
  const previousMap = new Map();

  const collect = (list, target) => {
    list.forEach((tx) => {
      if (tx.type !== "expense") return;
      const amount = toBaseAmount(tx, convert, baseCurrency);
      if (!amount) return;
      const key = tx.categoryId || "uncategorized";
      target.set(key, (target.get(key) || 0) + amount);
    });
  };

  collect(currentTransactions, currentMap);
  collect(previousTransactions, previousMap);

  const ids = new Set([...currentMap.keys(), ...previousMap.keys()]);

  return Array.from(ids)
    .map((id) => ({
      id,
      label: CATEGORY_NAMES[id] || id,
      current: currentMap.get(id) || 0,
      previous: previousMap.get(id) || 0,
    }))
    .sort((a, b) => b.current + b.previous - (a.current + a.previous))
    .slice(0, 8);
};

export const getDailyIncomeExpenseSeries = (
  transactions,
  start,
  end,
  convert,
  baseCurrency
) => {
  const series = [];

  for (let cursor = startOfDay(start); cursor <= endOfDay(end); cursor += DAY_MS) {
    const label = new Date(cursor).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });

    series.push({
      key: cursor,
      label,
      income: 0,
      expense: 0,
    });
  }

  const byDay = new Map(series.map((item) => [item.key, item]));

  transactions.forEach((tx) => {
    const dayKey = startOfDay(tx.date);
    const bucket = byDay.get(dayKey);
    if (!bucket) return;

    const amount = toBaseAmount(tx, convert, baseCurrency);
    if (!amount) return;

    if (tx.type === "income") bucket.income += amount;
    if (tx.type === "expense") bucket.expense += amount;
  });

  return series;
};

export const getCycleMs = (cycle) => {
  if (cycle === "week") return 7 * DAY_MS;
  if (cycle === "year") return 365 * DAY_MS;
  return 30 * DAY_MS;
};

export const shiftDateByCycle = (value, cycle, step = 1) => {
  const date = new Date(Number(value) || Date.now());
  const safeStep = Number.isFinite(step) ? step : 0;

  if (cycle === "week") {
    date.setDate(date.getDate() + safeStep * 7);
    return startOfDay(date.getTime());
  }

  if (cycle === "year") {
    date.setFullYear(date.getFullYear() + safeStep);
    return startOfDay(date.getTime());
  }

  date.setMonth(date.getMonth() + safeStep);
  return startOfDay(date.getTime());
};

export const getSubscriptionStatus = (
  subscription,
  transactions,
  now = Date.now()
) => {
  if (!subscription?.isActive) return "inactive";

  const dueDate = Number(subscription.nextDueDate) || startOfDay(now);
  const cycle = subscription.cycle || "month";
  const cycleStart = shiftDateByCycle(dueDate, cycle, -1);
  const remindBeforeDays = Number(subscription.remindBeforeDays) || 7;

  const paidInCurrentCycle = transactions.some((tx) => {
    if (tx.subscriptionId !== subscription.id) return false;
    if (tx.type !== "expense") return false;
    return tx.date >= cycleStart && tx.date <= dueDate;
  });

  if (paidInCurrentCycle) return "paidInCurrentCycle";
  if (dueDate < startOfDay(now)) return "overdue";
  if (dueDate - now <= remindBeforeDays * DAY_MS) return "dueSoon";
  return "active";
};

export const advanceSubscriptionDueDate = (
  subscription,
  paymentDate = Date.now()
) => {
  const dueDate = Number(subscription?.nextDueDate) || startOfDay(paymentDate);
  const cycle = subscription?.cycle || "month";

  let nextDue = dueDate;
  while (nextDue <= paymentDate) {
    nextDue = shiftDateByCycle(nextDue, cycle, 1);
  }

  return nextDue;
};

export const getGoalProgress = (
  goal,
  transactions,
  convert,
  baseCurrency,
  now = Date.now()
) => {
  const targetDate = Number(goal?.targetDate);
  const safeTargetDate = Number.isFinite(targetDate)
    ? targetDate
    : startOfDay(now);

  const target = convert(
    Number(goal?.targetAmount) || 0,
    goal?.currency || baseCurrency,
    baseCurrency
  );

  const linkedAccountId = goal?.linkedAccountId || "";

  const current = transactions.reduce((sum, tx) => {
    if (tx.goalId !== goal.id) return sum;

    const amount = toBaseAmount(tx, convert, baseCurrency);
    if (!amount) return sum;

    if (tx.type === "income") return sum + amount;
    if (tx.type === "expense") return sum - amount;

    if (tx.type === "transfer") {
      if (linkedAccountId) {
        if (tx.to === linkedAccountId) return sum + amount;
        if (tx.from === linkedAccountId) return sum - amount;
      }
      return sum + amount;
    }

    return sum;
  }, 0);

  const progressAmount = Math.max(0, current);
  const safeTarget = Math.max(0, Number(target) || 0);
  const percent = safeTarget > 0 ? Math.min(100, (progressAmount / safeTarget) * 100) : 0;
  const remaining = Math.max(0, safeTarget - progressAmount);
  const daysLeft = Math.max(0, Math.ceil((safeTargetDate - startOfDay(now)) / DAY_MS));

  const frequencyDays = goal?.frequency === "week" ? 7 : 30;
  const periodsLeft = Math.max(1, Math.ceil(daysLeft / frequencyDays));
  const requiredPerPeriod = remaining > 0 ? remaining / periodsLeft : 0;

  const status = !goal?.isActive
    ? "inactive"
    : remaining <= 0
    ? "completed"
    : "active";

  return {
    progressAmount,
    targetAmount: safeTarget,
    percent,
    remaining,
    daysLeft,
    requiredPerPeriod,
    status,
  };
};
