export const getDateValue = (value) => {
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && asNumber > 0) return asNumber;

  const asDate = new Date(value).getTime();
  return Number.isFinite(asDate) ? asDate : Date.now();
};

export const normalizeTransaction = (tx, fallbackId = null) => {
  if (!tx || typeof tx !== "object") return null;

  const type = ["income", "expense", "transfer"].includes(tx.type)
    ? tx.type
    : "expense";

  const amount = Number(tx.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const from = tx.from || tx.fromAccountId || "";
  const to = tx.to || tx.toAccountId || "";

  const categoryId =
    type === "transfer"
      ? "transfer"
      : tx.categoryId || tx.category || "uncategorized";

  return {
    id: String(tx.id || fallbackId || Date.now()),
    type,
    amount,
    currency: tx.currency || "KZT",
    categoryId,
    note: String(tx.note || "").trim(),
    date: getDateValue(tx.date),
    from,
    to,
    subscriptionId: tx.subscriptionId ? String(tx.subscriptionId) : null,
    goalId: tx.goalId ? String(tx.goalId) : null,
  };
};

export const normalizeSubscription = (data, fallbackId = null) => {
  if (!data || typeof data !== "object") return null;

  const amount = Number(data.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const cycle = ["week", "month", "year"].includes(data.cycle)
    ? data.cycle
    : "month";

  const remindBeforeDays = Math.max(1, Number(data.remindBeforeDays) || 7);

  return {
    id: String(data.id || fallbackId || Date.now()),
    name: String(data.name || "").trim() || "Подписка",
    amount,
    currency: data.currency || "KZT",
    cycle,
    startDate: getDateValue(data.startDate),
    nextDueDate: getDateValue(data.nextDueDate),
    accountId: String(data.accountId || ""),
    categoryId: String(data.categoryId || "uncategorized"),
    isActive: data.isActive !== false,
    remindBeforeDays,
    note: String(data.note || "").trim(),
  };
};

export const normalizeGoal = (data, fallbackId = null) => {
  if (!data || typeof data !== "object") return null;

  const targetAmount = Number(data.targetAmount);
  if (!Number.isFinite(targetAmount) || targetAmount <= 0) return null;

  return {
    id: String(data.id || fallbackId || Date.now()),
    title: String(data.title || "").trim() || "Цель",
    targetAmount,
    currency: data.currency || "KZT",
    startDate: getDateValue(data.startDate),
    targetDate: getDateValue(data.targetDate),
    plannedContribution: Math.max(0, Number(data.plannedContribution) || 0),
    frequency: data.frequency === "week" ? "week" : "month",
    linkedAccountId: String(data.linkedAccountId || ""),
    isActive: data.isActive !== false,
    note: String(data.note || "").trim(),
  };
};
