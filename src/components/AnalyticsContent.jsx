import { useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  ChartPie,
  Sigma,
} from "lucide-react";
import { useCurrency } from "../context/useCurrency";
import { formatMoney } from "../utils/formatMoney";
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
  PointElement,
  LineElement,
  BarElement,
  Filler
);

const CATEGORY_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
];

const calcTrend = (current, previous) => {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
    return null;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
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

  const doughnutData = useMemo(
    () => ({
      labels: expensesByCategory.map((item) => item.label),
      datasets: [
        {
          data: expensesByCategory.map((item) => item.value),
          backgroundColor: expensesByCategory.map(
            (_, index) => CATEGORY_COLORS[index % CATEGORY_COLORS.length]
          ),
          borderWidth: 0,
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
          backgroundColor: "#7c3aed",
          borderRadius: 6,
        },
        {
          label: "Предыдущий период",
          data: categoriesCompare.map((item) => item.previous),
          backgroundColor: "#cbd5e1",
          borderRadius: 6,
        },
      ],
    }),
    [categoriesCompare]
  );

  const lineData = useMemo(
    () => ({
      labels: dailySeries.map((item) => item.label),
      datasets: [
        {
          label: "Доход",
          data: dailySeries.map((item) => item.income),
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.15)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: "Расход",
          data: dailySeries.map((item) => item.expense),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    }),
    [dailySeries]
  );

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: "0 16px 96px",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Аналитика</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          Детальный разбор расходов и динамики
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

      <SurfaceCard title="Расходы по категориям" icon={ChartPie} style={{ marginBottom: 12 }}>
        <div style={{ height: 240 }}>
          {expensesByCategory.length ? (
            <Doughnut
              data={doughnutData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Сравнение категорий" icon={Activity} style={{ marginBottom: 12 }}>
        <div style={{ height: 240 }}>
          {categoriesCompare.length ? (
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Тренд доход/расход" icon={Activity} style={{ marginBottom: 12 }}>
        <div style={{ height: 240 }}>
          <Line
            data={lineData}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { position: "bottom" } },
              interaction: { mode: "index", intersect: false },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      </SurfaceCard>

      <SurfaceCard title="Топ категорий" icon={ChartPie}>
        {expensesByCategory.length ? (
          expensesByCategory.slice(0, 5).map((category) => {
            const percent = totals.expense
              ? Math.round((category.value / totals.expense) * 100)
              : 0;
            const color = categoryColorById[category.id] || "var(--primary)";

            return (
              <div
                key={category.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>{category.label}</span>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: color,
                      }}
                    />
                    <span>
                      {formatMoney(category.value, baseCurrency)} • {percent}%
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: "var(--border)",
                    overflow: "hidden",
                    marginTop: 6,
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, percent)}%`,
                      height: "100%",
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
    Недостаточно данных для выбранного периода
  </div>
);
