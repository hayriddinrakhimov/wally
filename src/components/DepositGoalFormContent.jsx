import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDateInput } from "../utils/dateRanges";
import { GOAL_FREQUENCY_OPTIONS } from "../utils/financeSelectors";

const createDefaultDraft = (accounts = []) => {
  const now = Date.now();
  const target = now + 1000 * 60 * 60 * 24 * 90;

  return {
    title: "",
    targetAmount: "",
    currency: "KZT",
    startDate: now,
    targetDate: target,
    plannedContribution: "",
    frequency: "month",
    linkedAccountId: accounts.find((account) => account.type === "deposit")?.id || accounts[0]?.id || "",
    isActive: true,
    note: "",
  };
};

export const DepositGoalFormContent = ({
  goal,
  accounts = [],
  onSave,
  onDelete,
}) => {
  const [form, setForm] = useState(() =>
    goal
      ? {
          ...goal,
          targetAmount: String(goal.targetAmount ?? ""),
          plannedContribution: String(goal.plannedContribution ?? ""),
        }
      : createDefaultDraft(accounts)
  );

  const canDelete = useMemo(() => Boolean(goal?.id), [goal?.id]);

  const submit = useCallback(() => {
    onSave({
      ...(goal || {}),
      ...form,
    });
  }, [onSave, form, goal]);

  useEffect(() => {
    document.addEventListener("submitGoal", submit);
    return () => document.removeEventListener("submitGoal", submit);
  }, [submit]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
      <Field label="Название цели">
        <input
          value={form.title}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, title: event.target.value }))
          }
          placeholder="Например: Подушка безопасности"
          style={inputStyle}
        />
      </Field>

      <Row>
        <Field label="Целевая сумма">
          <input
            value={form.targetAmount}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, targetAmount: event.target.value }))
            }
            type="number"
            min="0"
            style={inputStyle}
          />
        </Field>

        <Field label="Валюта">
          <select
            value={form.currency}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, currency: event.target.value }))
            }
            style={inputStyle}
          >
            <option value="KZT">KZT</option>
            <option value="USD">USD</option>
            <option value="RUB">RUB</option>
          </select>
        </Field>
      </Row>

      <Row>
        <Field label="Старт">
          <input
            type="date"
            value={formatDateInput(form.startDate)}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                startDate: new Date(`${event.target.value}T00:00:00`).getTime(),
              }))
            }
            style={inputStyle}
          />
        </Field>

        <Field label="Дедлайн">
          <input
            type="date"
            value={formatDateInput(form.targetDate)}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                targetDate: new Date(`${event.target.value}T00:00:00`).getTime(),
              }))
            }
            style={inputStyle}
          />
        </Field>
      </Row>

      <Row>
        <Field label="Плановое пополнение">
          <input
            value={form.plannedContribution}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                plannedContribution: event.target.value,
              }))
            }
            type="number"
            min="0"
            style={inputStyle}
          />
        </Field>

        <Field label="Частота">
          <select
            value={form.frequency}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, frequency: event.target.value }))
            }
            style={inputStyle}
          >
            {GOAL_FREQUENCY_OPTIONS.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      </Row>

      <Field label="Связанный счет">
        <select
          value={form.linkedAccountId}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, linkedAccountId: event.target.value }))
          }
          style={inputStyle}
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Комментарий">
        <textarea
          value={form.note || ""}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, note: event.target.value }))
          }
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </Field>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          paddingBottom: 8,
        }}
      >
        <input
          type="checkbox"
          checked={Boolean(form.isActive)}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, isActive: event.target.checked }))
          }
        />
        Активная цель
      </label>

      {canDelete && (
        <button
          onClick={() => onDelete(goal.id)}
          style={{
            height: 40,
            borderRadius: 8,
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontWeight: 600,
          }}
        >
          Переместить в архив
        </button>
      )}
    </div>
  );
};

const Row = ({ children }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 10,
    }}
  >
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
    <span style={{ color: "var(--text-secondary)" }}>{label}</span>
    {children}
  </label>
);

const inputStyle = {
  width: "100%",
  height: 38,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  padding: "0 10px",
  outline: "none",
  fontSize: 14,
};
