import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useCurrency } from "../context/useCurrency";
import { getCurrentMonthRange, getRangeWithPrevious } from "../utils/dateRanges";
import {
  filterTransactionsByRange,
  getSubscriptionStatus,
  shiftDateByCycle,
  toBaseAmount,
} from "../utils/financeSelectors";
import { formatMoney } from "../utils/formatMoney";
import { DateRangePicker } from "./common/DateRangePicker";
import { SurfaceCard } from "./common/SurfaceCard";

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
  const monthRange = getCurrentMonthRange();
  const [dateRange, setDateRange] = useState({
    start: monthRange.start,
    end: monthRange.end,
  });
  const { baseCurrency, convert } = useCurrency();

  const range = useMemo(
    () => getRangeWithPrevious(dateRange.start, dateRange.end),
    [dateRange.start, dateRange.end]
  );

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

  const indicators = useMemo(() => {
    return items.reduce(
      (acc, subscription) => {
        if (subscription.status === "overdue") acc.overdue += 1;
        if (subscription.status === "dueSoon") acc.dueSoon += 1;
        if (subscription.status === "paidInCurrentCycle") acc.paid += 1;
        return acc;
      },
      { paid: 0, dueSoon: 0, overdue: 0 }
    );
  }, [items]);

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
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <button
          type="button"
          title="Добавить подписку"
          aria-label="Добавить подписку"
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

      <DateRangePicker
        start={dateRange.start}
        end={dateRange.end}
        onChange={(start, end) => setDateRange({ start, end })}
      />

      <SurfaceCard delay={0} style={{ marginBottom: 12 }}>
        <SummaryRow
          label="Ожидается в период"
          value={formatMoney(expectedInPeriod, baseCurrency)}
        />
        <SummaryRow
          label="Оплачено в период"
          value={formatMoney(paidInPeriod, baseCurrency)}
        />
        <SummaryRow
          label="Остаток"
          value={formatMoney(
            Math.max(0, expectedInPeriod - paidInPeriod),
            baseCurrency
          )}
        />
      </SurfaceCard>

      <SurfaceCard delay={0.05} style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          <Indicator
            title="Оплачено"
            value={indicators.paid}
            tone="green"
            icon={CheckCircle2}
          />
          <Indicator title="Скоро" value={indicators.dueSoon} tone="amber" icon={Clock3} />
          <Indicator
            title="Просрочено"
            value={indicators.overdue}
            tone="red"
            icon={AlertTriangle}
          />
        </div>
      </SurfaceCard>

      <SurfaceCard delay={0.1}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Ближайшие платежи</div>

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
          const avatarText = String(subscription.name || "S").trim().charAt(0).toUpperCase();

          return (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16 }}
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
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: status.color,
                      background: status.bg,
                      flexShrink: 0,
                    }}
                  >
                    {avatarText}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {subscription.name || "Без названия"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {accountName} • {subscription.cycle || "month"}
                    </div>
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
                    fontWeight: 700,
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
                    type="button"
                    onClick={() => onMarkPaid(subscription)}
                    title="Отметить оплату"
                    style={iconBtnStyle}
                    disabled={!subscription.isActive}
                  >
                    <CheckCircle2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(subscription)}
                    title="Редактировать"
                    style={iconBtnStyle}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onArchive(subscription)}
                    title="В архив"
                    style={iconBtnStyle}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </SurfaceCard>

      <SurfaceCard style={{ marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarClock size={16} />
          <div style={{ fontSize: 13 }}>
            Платежи со связанной операцией автоматически получают статус "Оплачена".
          </div>
        </div>
      </SurfaceCard>
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

const Indicator = ({ title, value, tone, icon: Icon = null }) => {
  const toneMap = {
    green: { fg: "#166534", bg: "#dcfce7", soft: "rgba(22, 101, 52, 0.16)" },
    amber: { fg: "#92400e", bg: "#fef3c7", soft: "rgba(146, 64, 14, 0.16)" },
    red: { fg: "#991b1b", bg: "#fee2e2", soft: "rgba(153, 27, 27, 0.16)" },
  };
  const color = toneMap[tone] || toneMap.green;

  return (
    <div
      style={{
        borderRadius: 8,
        border: "1px solid var(--border)",
        padding: 8,
        background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{title}</div>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 6,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: color.fg,
            background: color.soft,
          }}
        >
          {Icon ? <Icon size={11} /> : null}
        </span>
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 24,
          height: 20,
          borderRadius: 999,
          padding: "0 8px",
          fontSize: 11,
          fontWeight: 700,
          color: color.fg,
          background: color.bg,
          transition: "all 0.2s ease",
        }}
      >
        {value}
      </div>
    </div>
  );
};

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
