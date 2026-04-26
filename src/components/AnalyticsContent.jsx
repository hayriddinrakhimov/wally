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
import { useCurrency } from "../context/useCurrency";
import { formatMoney } from "../utils/formatMoney";
import { PERIOD_OPTIONS, getPeriodRange } from "../utils/dateRanges";
import {
  filterTransactionsByRange,
  getCategoryComparison,
  getDailyIncomeExpenseSeries,
  getExpenseByCategory,
  getKpiTotals,
} from "../utils/financeSelectors";

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

const cardStyle = {
  border: "1px solid var(--border)",
  borderRadius: 8,
  background: "var(--bg)",
  padding: 12,
};

export const AnalyticsContent = ({ transactions = [] }) => {
  const [periodKey, setPeriodKey] = useState("currentMonth");
  const { convert, baseCurrency } = useCurrency();

  const range = useMemo(() => getPeriodRange(periodKey), [periodKey]);

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

  const expensesByCategory = useMemo(
    () => getExpenseByCategory(currentTransactions, convert, baseCurrency),
    [currentTransactions, convert, baseCurrency]
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
          label: "Текущий",
          data: categoriesCompare.map((item) => item.current),
          backgroundColor: "#3b82f6",
          borderRadius: 6,
        },
        {
          label: "Прошлый",
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
          Срез по категориям и трендам
        </div>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <KpiCard title="Доход" value={formatMoney(totals.income, baseCurrency)} />
        <KpiCard title="Расход" value={formatMoney(totals.expense, baseCurrency)} />
        <KpiCard title="Итог" value={formatMoney(totals.net, baseCurrency)} />
      </div>

      <div style={{ ...cardStyle, marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Расходы по категориям</div>
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
      </div>

      <div style={{ ...cardStyle, marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Сравнение категорий</div>
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
      </div>

      <div style={{ ...cardStyle, marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Тренд доход/расход</div>
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
      </div>

      <div style={cardStyle}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Топ категорий</div>
        {expensesByCategory.length ? (
          expensesByCategory.slice(0, 5).map((category) => {
            const percent = totals.expense
              ? Math.round((category.value / totals.expense) * 100)
              : 0;

            return (
              <div
                key={category.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 13,
                }}
              >
                <span>{category.label}</span>
                <span>
                  {formatMoney(category.value, baseCurrency)} • {percent}%
                </span>
              </div>
            );
          })
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

const KpiCard = ({ title, value }) => (
  <div style={cardStyle}>
    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>
      {title}
    </div>
    <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
  </div>
);

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
    Недостаточно данных
  </div>
);
