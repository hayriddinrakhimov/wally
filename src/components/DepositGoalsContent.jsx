import { ArrowDownLeft, ArrowUpRight, Pencil, PiggyBank, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useCurrency } from "../context/useCurrency";
import { GOAL_FREQUENCY_OPTIONS, getGoalProgress } from "../utils/financeSelectors";
import { formatMoney } from "../utils/formatMoney";

const cardStyle = {
  border: "1px solid var(--border)",
  borderRadius: 8,
  background: "var(--bg)",
  padding: 12,
};

export const DepositGoalsContent = ({
  goals = [],
  transactions = [],
  accounts = [],
  onCreate,
  onEdit,
  onArchive,
  onTopUp,
  onWithdraw,
}) => {
  const { convert, baseCurrency } = useCurrency();

  const goalsWithProgress = useMemo(() => {
    return goals
      .map((goal) => ({
        ...goal,
        progress: getGoalProgress(goal, transactions, convert, baseCurrency),
      }))
      .sort((a, b) => {
        if (a.progress.status !== b.progress.status) {
          return a.progress.status === "active" ? -1 : 1;
        }

        return a.progress.daysLeft - b.progress.daysLeft;
      });
  }, [goals, transactions, convert, baseCurrency]);

  const activeGoals = goalsWithProgress.filter(
    (goal) => goal.progress.status === "active"
  );
  const completedGoals = goalsWithProgress.filter(
    (goal) => goal.progress.status !== "active"
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <button
          type="button"
          title="Добавить цель"
          aria-label="Добавить цель"
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

      <SectionTitle title="Активные цели" />
      {activeGoals.length === 0 && <EmptyCard text="Активных целей пока нет" />}
      {activeGoals.map((goal) => {
        const accountName =
          accounts.find((account) => account.id === goal.linkedAccountId)?.name || "—";

        const frequencyLabel =
          GOAL_FREQUENCY_OPTIONS.find((item) => item.key === goal.frequency)?.label ||
          "Месяц";

        return (
          <div key={goal.id} style={{ ...cardStyle, marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{goal.title || "Без названия"}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {accountName} • {frequencyLabel}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>
                  {Math.round(goal.progress.percent)}%
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {goal.progress.daysLeft} дн.
                </div>
              </div>
            </div>

            <div
              style={{
                height: 8,
                borderRadius: 999,
                overflow: "hidden",
                background: "#e5e7eb",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: `${goal.progress.percent}%`,
                  height: "100%",
                  background: "var(--primary)",
                }}
              />
            </div>

            <div style={{ fontSize: 13, marginBottom: 4 }}>
              Накоплено:{" "}
              <strong>{formatMoney(goal.progress.progressAmount, baseCurrency)}</strong>
            </div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              Цель: <strong>{formatMoney(goal.progress.targetAmount, baseCurrency)}</strong>
            </div>
            <div style={{ fontSize: 13, marginBottom: 10 }}>
              Нужно за {frequencyLabel.toLowerCase()}:{" "}
              <strong>
                {formatMoney(goal.progress.requiredPerPeriod, baseCurrency)}
              </strong>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => onTopUp(goal)}
                style={actionBtnStyle}
              >
                <ArrowUpRight size={14} /> Пополнить
              </button>
              <button
                type="button"
                onClick={() => onWithdraw(goal)}
                style={actionBtnStyle}
              >
                <ArrowDownLeft size={14} /> Снять
              </button>
              <button
                type="button"
                title="Редактировать цель"
                onClick={() => onEdit(goal)}
                style={actionBtnStyle}
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                title="В архив"
                onClick={() => onArchive(goal)}
                style={actionBtnStyle}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}

      <SectionTitle title="Завершенные / архив" />
      {completedGoals.length === 0 && <EmptyCard text="Пока нет завершенных целей" />}
      {completedGoals.map((goal) => (
        <div key={goal.id} style={{ ...cardStyle, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PiggyBank size={16} />
            <div style={{ fontWeight: 700 }}>{goal.title || "Без названия"}</div>
          </div>
          <div style={{ fontSize: 13, marginTop: 6 }}>
            {formatMoney(goal.progress.progressAmount, baseCurrency)} /{" "}
            {formatMoney(goal.progress.targetAmount, baseCurrency)}
          </div>
        </div>
      ))}
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <div
    style={{
      fontSize: 12,
      fontWeight: 700,
      textTransform: "uppercase",
      color: "var(--text-secondary)",
      marginBottom: 8,
      marginTop: 10,
    }}
  >
    {title}
  </div>
);

const EmptyCard = ({ text }) => (
  <div style={{ ...cardStyle, marginBottom: 10, color: "var(--text-secondary)" }}>
    {text}
  </div>
);

const actionBtnStyle = {
  height: 32,
  borderRadius: 8,
  border: "1px solid var(--border)",
  padding: "0 10px",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 12,
};
