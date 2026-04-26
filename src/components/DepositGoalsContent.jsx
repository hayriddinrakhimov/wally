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

      <SectionTitle title="РђРєС‚РёРІРЅС‹Рµ С†РµР»Рё" />
      {activeGoals.length === 0 && <EmptyCard text="РђРєС‚РёРІРЅС‹С… С†РµР»РµР№ РїРѕРєР° РЅРµС‚" />}
      {activeGoals.map((goal) => {
        const accountName =
          accounts.find((account) => account.id === goal.linkedAccountId)?.name || "вЂ”";

        const frequencyLabel =
          GOAL_FREQUENCY_OPTIONS.find((item) => item.key === goal.frequency)?.label ||
          "РњРµСЃСЏС†";

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
                <div style={{ fontWeight: 700 }}>{goal.title || "Р‘РµР· РЅР°Р·РІР°РЅРёСЏ"}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {accountName} вЂў {frequencyLabel}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>
                  {Math.round(goal.progress.percent)}%
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {goal.progress.daysLeft} РґРЅ.
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
              РќР°РєРѕРїР»РµРЅРѕ:{" "}
              <strong>{formatMoney(goal.progress.progressAmount, baseCurrency)}</strong>
            </div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              Р¦РµР»СЊ: <strong>{formatMoney(goal.progress.targetAmount, baseCurrency)}</strong>
            </div>
            <div style={{ fontSize: 13, marginBottom: 10 }}>
              РќСѓР¶РЅРѕ Р·Р° {frequencyLabel.toLowerCase()}:{" "}
              <strong>
                {formatMoney(goal.progress.requiredPerPeriod, baseCurrency)}
              </strong>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button onClick={() => onTopUp(goal)} style={actionBtnStyle}>
                <ArrowUpRight size={14} /> РџРѕРїРѕР»РЅРёС‚СЊ
              </button>
              <button onClick={() => onWithdraw(goal)} style={actionBtnStyle}>
                <ArrowDownLeft size={14} /> РЎРЅСЏС‚СЊ
              </button>
              <button onClick={() => onEdit(goal)} style={actionBtnStyle}>
                <Pencil size={14} />
              </button>
              <button onClick={() => onArchive(goal)} style={actionBtnStyle}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}

      <SectionTitle title="Р—Р°РІРµСЂС€РµРЅРЅС‹Рµ / Р°СЂС…РёРІ" />
      {completedGoals.length === 0 && <EmptyCard text="РџРѕРєР° РЅРµС‚ Р·Р°РІРµСЂС€РµРЅРЅС‹С… С†РµР»РµР№" />}
      {completedGoals.map((goal) => (
        <div key={goal.id} style={{ ...cardStyle, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PiggyBank size={16} />
            <div style={{ fontWeight: 700 }}>{goal.title || "Р‘РµР· РЅР°Р·РІР°РЅРёСЏ"}</div>
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
