import { useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  ChartPie,
  Sigma,
  Sparkles,
} from "lucide-react";
import { useCurrency } from "../context/useCurrency";
import { formatMoney, formatMoneySmart } from "../utils/formatMoney";
import { getCurrentMonthRange, getRangeWithPrevious } from "../utils/dateRanges";
import {
  filterTransactionsByRange,
  getCategoryComparison,
  getDailyIncomeExpenseSeries,
  getExpenseByCategory,
  getKpiTotals,
} from "../utils/financeSelectors";
import { DateRangePicker } from "./common/DateRangePicker";
import { MetricCard } from "./common/MetricCard";
import { SurfaceCard } from "./common/SurfaceCard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const CATEGORY_COLORS = [
  "#3b82f6",
  "#14b8a6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#f97316",
  "#6366f1",
];

const FLOW_TONES = {
  green: {
    bar: "#16a34a",
    soft: "rgba(22, 163, 74, 0.12)",
    text: "#166534",
    border: "rgba(22, 163, 74, 0.24)",
  },
  red: {
    bar: "#ef4444",
    soft: "rgba(239, 68, 68, 0.12)",
    text: "#b91c1c",
    border: "rgba(239, 68, 68, 0.24)",
  },
};

const calcTrend = (current, previous) => {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
    return null;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
};

const formatRangeDate = (value) => {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });
};

const DAY_MS = 24 * 60 * 60 * 1000;

const getFlowRows = (series, key) => {
  const rows = series.slice(-7).map((item) => ({
    label: item.label,
    value: Number(item[key]) || 0,
  }));

  const maxValue = Math.max(1, ...rows.map((item) => item.value));

  return rows.map((item) => ({
    ...item,
    ratio: item.value > 0 ? item.value / maxValue : 0,
  }));
};

const getPeakRow = (rows) => {
  return rows.reduce(
    (best, row) => (row.value > best.value ? row : best),
    { label: "—", value: 0, ratio: 0 }
  );
};

export const AnalyticsContent = ({ transactions = [] }) => {
  const monthRange = getCurrentMonthRange();
  const [dateRange, setDateRange] = useState({
    start: monthRange.start,
    end: monthRange.end,
  });

  const { convert, baseCurrency } = useCurrency();

  const range = useMemo(
    () => getRangeWithPrevious(dateRange.start, dateRange.end),
    [dateRange.start, dateRange.end]
  );

  const currentTransactions = useMemo(
    () => filterTransactionsByRange(transactions, range.start, range.end),
    [transactions, range.start, range.end]
  );

  const previousTransactions = useMemo(
    () =>
      filterTransactionsByRange(
        transactions,
        range.previousStart,
        range.previousEnd
      ),
    [transactions, range.previousStart, range.previousEnd]
  );

  const totals = useMemo(
    () => getKpiTotals(currentTransactions, convert, baseCurrency),
    [currentTransactions, convert, baseCurrency]
  );

  const previousTotals = useMemo(
    () => getKpiTotals(previousTransactions, convert, baseCurrency),
    [previousTransactions, convert, baseCurrency]
  );

  const expensesByCategory = useMemo(
    () => getExpenseByCategory(currentTransactions, convert, baseCurrency),
    [currentTransactions, convert, baseCurrency]
  );

  const categoryColorById = useMemo(
    () =>
      expensesByCategory.reduce((acc, item, index) => {
        acc[item.id] = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
        return acc;
      }, {}),
    [expensesByCategory]
  );

  const categoriesCompare = useMemo(
    () =>
      getCategoryComparison(
        currentTransactions,
        previousTransactions,
        convert,
        baseCurrency
      ),
    [currentTransactions, previousTransactions, convert, baseCurrency]
  );

  const dailySeries = useMemo(
    () =>
      getDailyIncomeExpenseSeries(
        currentTransactions,
        range.start,
        range.end,
        convert,
        baseCurrency
      ),
    [currentTransactions, range.start, range.end, convert, baseCurrency]
  );

  const incomeRows = useMemo(() => getFlowRows(dailySeries, "income"), [dailySeries]);
  const expenseRows = useMemo(() => getFlowRows(dailySeries, "expense"), [dailySeries]);

  const incomePeak = useMemo(() => getPeakRow(incomeRows), [incomeRows]);
  const expensePeak = useMemo(() => getPeakRow(expenseRows), [expenseRows]);

  const operationsCount = currentTransactions.length;
  const periodDays = Math.max(1, Math.floor((range.end - range.start) / DAY_MS) + 1);
  const averageExpensePerDay = totals.expense / periodDays;
  const mainCategory = expensesByCategory[0] || null;
  const mainCategoryShare =
    mainCategory && totals.expense > 0
      ? Math.round((mainCategory.value / totals.expense) * 100)
      : 0;
  const netPositive = totals.net >= 0;

  const periodLabel = `${formatRangeDate(range.start)} — ${formatRangeDate(range.end)}`;

  const doughnutData = useMemo(
    () => ({
      labels: expensesByCategory.map((item) => item.label),
      datasets: [
        {
          data: expensesByCategory.map((item) => item.value),
          backgroundColor: expensesByCategory.map(
            (_, index) => CATEGORY_COLORS[index % CATEGORY_COLORS.length]
          ),
          borderColor: "#ffffff",
          borderWidth: 2,
          spacing: 2,
          hoverOffset: 6,
        },
      ],
    }),
    [expensesByCategory]
  );

  const barData = useMemo(
    () => ({
      labels: categoriesCompare.map((item) => item.label),
      datasets: [
        {
          label: "Текущий период",
          data: categoriesCompare.map((item) => item.current),
          backgroundColor: "rgba(59, 130, 246, 0.88)",
          borderRadius: 8,
        },
        {
          label: "Предыдущий период",
          data: categoriesCompare.map((item) => item.previous),
          backgroundColor: "rgba(148, 163, 184, 0.82)",
          borderRadius: 8,
        },
      ],
    }),
    [categoriesCompare]
  );

  const axisColor = "#64748b";
  const gridColor = "rgba(148, 163, 184, 0.24)";

  const tooltipStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    titleColor: "#e2e8f0",
    bodyColor: "#f8fafc",
    borderColor: "rgba(148, 163, 184, 0.45)",
    borderWidth: 1,
    cornerRadius: 10,
    padding: 10,
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: axisColor,
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          padding: 16,
          font: {
            size: 11,
            weight: "600",
          },
        },
      },
      tooltip: tooltipStyle,
    },
  };

  const barOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: axisColor,
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          padding: 14,
          font: {
            size: 11,
            weight: "600",
          },
        },
      },
      tooltip: tooltipStyle,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: axisColor,
          font: { size: 10, weight: "600" },
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: {
          color: axisColor,
          font: { size: 10 },
        },
      },
    },
  };

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
          border: "1px solid var(--border)",
          borderRadius: 16,
          background: "linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)",
          padding: 12,
          marginBottom: 12,
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Период</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{periodLabel}</div>
          </div>

          <div
            style={{
              height: 28,
              borderRadius: 999,
              padding: "0 10px",
              border: "1px solid rgba(59, 130, 246, 0.24)",
              background: "rgba(59, 130, 246, 0.08)",
              color: "#1d4ed8",
              fontWeight: 700,
              fontSize: 11,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Sparkles size={12} />
            {operationsCount} операций
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          <SummaryPill
            label="Чистый итог"
            value={formatMoneySmart(totals.net, baseCurrency)}
            tone={netPositive ? "green" : "red"}
          />
          <SummaryPill
            label="Средний расход"
            value={formatMoneySmart(averageExpensePerDay, baseCurrency)}
            tone="blue"
          />
          <SummaryPill
            label="Топ-категория"
            value={mainCategory ? `${mainCategory.label} · ${mainCategoryShare}%` : "Нет данных"}
            tone="amber"
          />
        </div>
      </div>

      <DateRangePicker
        start={dateRange.start}
        end={dateRange.end}
        onChange={(start, end) => setDateRange({ start, end })}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <MetricCard
          title="Доход"
          value={formatMoney(totals.income, baseCurrency)}
          icon={ArrowUpCircle}
          trend={calcTrend(totals.income, previousTotals.income)}
          tone="green"
        />

        <MetricCard
          title="Расход"
          value={formatMoney(totals.expense, baseCurrency)}
          icon={ArrowDownCircle}
          trend={calcTrend(totals.expense, previousTotals.expense)}
          tone="red"
        />

        <MetricCard
          title="Итог"
          value={formatMoney(totals.net, baseCurrency)}
          icon={Sigma}
          trend={calcTrend(totals.net, previousTotals.net)}
          tone="purple"
        />
      </div>

      <SurfaceCard
        title="Расходы по категориям"
        icon={ChartPie}
        style={{ marginBottom: 12 }}
      >
        <div style={{ height: 246 }}>
          {expensesByCategory.length ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <EmptyState />
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Сравнение категорий"
        icon={Activity}
        style={{ marginBottom: 12 }}
      >
        <div style={{ height: 246 }}>
          {categoriesCompare.length ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <EmptyState />
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Динамика по дням"
        icon={Activity}
        style={{ marginBottom: 12 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <FlowBlock
            title="Доход"
            tone="green"
            totalLabel={formatMoney(totals.income, baseCurrency)}
            peakLabel={
              incomePeak.value > 0
                ? `${incomePeak.label} · ${formatMoneySmart(incomePeak.value, baseCurrency)}`
                : "Нет начислений"
            }
            rows={incomeRows}
            baseCurrency={baseCurrency}
          />

          <FlowBlock
            title="Расход"
            tone="red"
            totalLabel={formatMoney(totals.expense, baseCurrency)}
            peakLabel={
              expensePeak.value > 0
                ? `${expensePeak.label} · ${formatMoneySmart(expensePeak.value, baseCurrency)}`
                : "Нет списаний"
            }
            rows={expenseRows}
            baseCurrency={baseCurrency}
          />
        </div>
      </SurfaceCard>

      <SurfaceCard title="Топ категорий" icon={ChartPie}>
        {expensesByCategory.length ? (
          expensesByCategory.slice(0, 5).map((category, index) => {
            const percent = totals.expense
              ? Math.round((category.value / totals.expense) * 100)
              : 0;
            const color = categoryColorById[category.id] || "var(--primary)";

            return (
              <div
                key={category.id}
                style={{
                  padding: "9px 0",
                  borderBottom: index === 4 ? "none" : "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#475569",
                        background: "rgba(148, 163, 184, 0.2)",
                      }}
                    >
                      {index + 1}
                    </span>

                    <span style={{ fontSize: 13, fontWeight: 600 }}>{category.label}</span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                      {formatMoney(category.value, baseCurrency)}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{percent}%</div>
                  </div>
                </div>

                <div
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: "rgba(148, 163, 184, 0.2)",
                    overflow: "hidden",
                    marginTop: 7,
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, percent)}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: color,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState />
        )}
      </SurfaceCard>
    </div>
  );
};

const FlowBlock = ({
  title,
  tone,
  totalLabel,
  peakLabel,
  rows,
  baseCurrency,
}) => {
  const palette = FLOW_TONES[tone] || FLOW_TONES.green;
  const activeRows = rows.filter((row) => row.value > 0);

  return (
    <div
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        background: palette.soft,
        padding: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          marginBottom: 7,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: palette.text }}>{title}</div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-secondary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Пик: {peakLabel}
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 800, color: palette.text }}>{totalLabel}</div>
      </div>

      {activeRows.length === 0 ? (
        <div style={{ fontSize: 12, color: "var(--text-secondary)", padding: "8px 0" }}>
          Нет операций в выбранном диапазоне
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {rows.map((row) => (
            <div
              key={`${title}-${row.label}`}
              style={{
                display: "grid",
                gridTemplateColumns: "42px 1fr auto",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{row.label}</span>

              <div
                style={{
                  height: 6,
                  borderRadius: 999,
                  overflow: "hidden",
                  background: "rgba(148, 163, 184, 0.24)",
                }}
              >
                <div
                  style={{
                    width: row.value > 0 ? `${Math.max(6, row.ratio * 100)}%` : "0%",
                    height: "100%",
                    borderRadius: 999,
                    background: palette.bar,
                  }}
                />
              </div>

              <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>
                {formatMoneySmart(row.value, baseCurrency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EmptyState = () => (
  <div
    style={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-secondary)",
      fontSize: 13,
      textAlign: "center",
      padding: 12,
    }}
  >
    Недостаточно данных за выбранный период.
  </div>
);

const SummaryPill = ({ label, value, tone = "blue" }) => {
  const tones = {
    blue: {
      bg: "rgba(59, 130, 246, 0.11)",
      border: "rgba(59, 130, 246, 0.22)",
      color: "#1d4ed8",
    },
    green: {
      bg: "rgba(22, 163, 74, 0.11)",
      border: "rgba(22, 163, 74, 0.22)",
      color: "#166534",
    },
    red: {
      bg: "rgba(239, 68, 68, 0.11)",
      border: "rgba(239, 68, 68, 0.22)",
      color: "#b91c1c",
    },
    amber: {
      bg: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.26)",
      color: "#92400e",
    },
  };

  const palette = tones[tone] || tones.blue;

  return (
    <div
      style={{
        minHeight: 58,
        borderRadius: 12,
        border: `1px solid ${palette.border}`,
        background: palette.bg,
        padding: "7px 9px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>{label}</div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: palette.color,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </div>
    </div>
  );
};
