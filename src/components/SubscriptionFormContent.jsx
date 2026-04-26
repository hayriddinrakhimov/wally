import { useCallback, useEffect, useMemo, useState } from "react";
import { CYCLE_OPTIONS } from "../utils/financeSelectors";
import { formatDateInput } from "../utils/dateRanges";

const createDefaultDraft = (accounts = []) => {
  const firstAccountId = accounts[0]?.id || "";
  const now = Date.now();

  return {
    name: "",
    amount: "",
    currency: "KZT",
    cycle: "month",
    startDate: now,
    nextDueDate: now,
    accountId: firstAccountId,
    categoryId: "uncategorized",
    isActive: true,
    remindBeforeDays: 7,
    note: "",
  };
};

export const SubscriptionFormContent = ({
  subscription,
  accounts = [],
  onSave,
  onDelete,
}) => {
  const [form, setForm] = useState(() =>
    subscription
      ? {
          ...subscription,
          amount: String(subscription.amount ?? ""),
        }
      : createDefaultDraft(accounts)
  );

  const canDelete = useMemo(() => Boolean(subscription?.id), [subscription?.id]);

  const submit = useCallback(() => {
    onSave({
      ...(subscription || {}),
      ...form,
    });
  }, [onSave, form, subscription]);

  useEffect(() => {
    document.addEventListener("submitSubscription", submit);
    return () => document.removeEventListener("submitSubscription", submit);
  }, [submit]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
      <Field label="Название">
        <input
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Например: Spotify"
          style={inputStyle}
        />
      </Field>

      <Row>
        <Field label="Сумма">
          <input
            value={form.amount}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, amount: event.target.value }))
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
        <Field label="Период">
          <select
            value={form.cycle}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, cycle: event.target.value }))
            }
            style={inputStyle}
          >
            {CYCLE_OPTIONS.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Напомнить за дней">
          <input
            value={form.remindBeforeDays}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                remindBeforeDays: Number(event.target.value),
              }))
            }
            type="number"
            min="1"
            style={inputStyle}
          />
        </Field>
      </Row>

      <Row>
        <Field label="Первая дата">
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

        <Field label="Ближайший платеж">
          <input
            type="date"
            value={formatDateInput(form.nextDueDate)}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                nextDueDate: new Date(`${event.target.value}T00:00:00`).getTime(),
              }))
            }
            style={inputStyle}
          />
        </Field>
      </Row>

      <Field label="Счет списания">
        <select
          value={form.accountId}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, accountId: event.target.value }))
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

      <Field label="Категория">
        <input
          value={form.categoryId || ""}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, categoryId: event.target.value }))
          }
          placeholder="Например: food"
          style={inputStyle}
        />
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
        Активная подписка
      </label>

      {canDelete && (
        <button
          onClick={() => onDelete(subscription.id)}
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
