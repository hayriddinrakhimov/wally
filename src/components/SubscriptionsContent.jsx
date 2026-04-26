import { CalendarClock, CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useCurrency } from "../context/useCurrency";
import { PERIOD_OPTIONS, getPeriodRange } from "../utils/dateRanges";
import {
  filterTransactionsByRange,
  getSubscriptionStatus,
  shiftDateByCycle,
  toBaseAmount,
} from "../utils/financeSelectors";
import { formatMoney } from "../utils/formatMoney";

const cardStyle = {
  border: "1px solid var(--border)",
  borderRadius: 8,
  background: "var(--bg)",
  padding: 12,
};

const STATUS_META = {
  active: { label: "Активна", color: "#334155", bg: "#f1f5f9" },
  dueSoon: { label: "Скоро платеж", color: "#92400e", bg: "#fef3c7" },
  overdue: { label: "Просрочена", color: "#991b1b", bg: "#fee2e2" },
  paidInCurrentCycle: { label: "Оплачена", color: "#166534", bg: "#dcfce7" },
  inactive: { label: "В архиве", color: "#6b7280", bg: "#f3f4f6" },
};

const getOccurrencesInRange = (subscription, start, end) => {
  if (!subscription?.isActive) return 0;

  let due = Number(subscription.nextDueDate) || Date.now();
  let count = 0;

  while (due < start) {
    due = shiftDateByCycle(due, subscription.cycle || "month", 1);
  }

  while (due <= end) {
    count += 1;
    due = shiftDateByCycle(due, subscription.cycle || "month", 1);
  }

  return count;
};

export const SubscriptionsContent = ({
  subscriptions = [],
  transactions = [],
  accounts = [],
  onCreate,
  onEdit,
  onArchive,
  onMarkPaid,
}) => {
  const [periodKey, setPeriodKey] = useState("currentMonth");
  const { baseCurrency, convert } = useCurrency();

  const range = useMemo(() => getPeriodRange(periodKey), [periodKey]);

  const transactionsInRange = useMemo(
    () => filterTransactionsByRange(transactions, range.start, range.end),
    [transactions, range.start, range.end]
  );

  const items = useMemo(() => {
    return subscriptions
      .map((subscription) => ({
        ...subscription,
        status: getSubscriptionStatus(subscription, transactions),
      }))
      .sort((a, b) => Number(a.nextDueDate) - Number(b.nextDueDate));
  }, [subscriptions, transactions]);

  const expectedInPeriod = useMemo(() => {
    return subscriptions.reduce((sum, subscription) => {
      const count = getOccurrencesInRange(subscription, range.start, range.end);
      if (!count) return sum;

      const value = convert(
        Number(subscription.amount) * count,
        subscription.currency || baseCurrency,
        baseCurrency
      );

      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
  }, [subscriptions, range.start, range.end, convert, baseCurrency]);

  const paidInPeriod = useMemo(() => {
    return transactionsInRange.reduce((sum, tx) => {
      if (!tx.subscriptionId) return sum;
      if (tx.type !== "expense") return sum;
      return sum + toBaseAmount(tx, convert, baseCurrency);
    }, 0);
  }, [transactionsInRange, convert, baseCurrency]);

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: "0 16px 96px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Подписки</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Регулярные платежи и напоминания
          </div>
        </div>

        <button
          onClick={onCreate}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: "1px solid var(--primary)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {PERIOD_OPTIONS.map((option) => {
          const active = periodKey === option.key;

          return (
            <button
              key={option.key}
              onClick={() => setPeriodKey(option.key)}
              style={{
                height: 34,
                borderRadius: 8,
                border: active ? "none" : "1px solid var(--border)",
                background: active ? "var(--primary)" : "transparent",
                color: active ? "#fff" : "var(--text)",
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div style={{ ...cardStyle, marginBottom: 12 }}>
        <SummaryRow
          label="Ожидаемо в период"
          value={formatMoney(expectedInPeriod, baseCurrency)}
        />
        <SummaryRow
          label="Оплачено в период"
          value={formatMoney(paidInPeriod, baseCurrency)}
        />
        <SummaryRow
          label="Остаток"
          value={formatMoney(Math.max(0, expectedInPeriod - paidInPeriod), baseCurrency)}
        />
      </div>

      <div style={cardStyle}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Ближайшие платежи</div>

        {items.length === 0 && (
          <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            Пока нет подписок
          </div>
        )}

        {items.map((subscription) => {
          const status = STATUS_META[subscription.status] || STATUS_META.active;
          const accountName =
            accounts.find((account) => account.id === subscription.accountId)?.name ||
            "—";

          return (
            <div
              key={subscription.id}
              style={{
                borderTop: "1px solid var(--border)",
                padding: "10px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {subscription.name || "Без названия"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {accountName} • {subscription.cycle || "month"}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>
                    {formatMoney(subscription.amount, subscription.currency || "KZT")}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {new Date(subscription.nextDueDate).toLocaleDateString("ru-RU")}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 8,
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 8px",
                    borderRadius: 999,
                    color: status.color,
                    background: status.bg,
                    whiteSpace: "nowrap",
                  }}
                >
                  {status.label}
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => onMarkPaid(subscription)}
                    title="Отметить оплату"
                    style={iconBtnStyle}
                    disabled={!subscription.isActive}
                  >
                    <CheckCircle2 size={14} />
                  </button>
                  <button
                    onClick={() => onEdit(subscription)}
                    title="Редактировать"
                    style={iconBtnStyle}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onArchive(subscription)}
                    title="В архив"
                    style={iconBtnStyle}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ ...cardStyle, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarClock size={16} />
          <div style={{ fontSize: 13 }}>
            Платежи со связанной операцией автоматически получают статус "Оплачена".
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "6px 0",
      fontSize: 13,
      borderBottom: "1px solid var(--border)",
    }}
  >
    <span>{label}</span>
    <span style={{ fontWeight: 700 }}>{value}</span>
  </div>
);

const iconBtnStyle = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "1px solid var(--border)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text)",
};
