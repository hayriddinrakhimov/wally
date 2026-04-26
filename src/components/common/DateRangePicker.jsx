import { CalendarDays, RotateCcw } from "lucide-react";
import { formatDateInput, getCurrentMonthRange, parseDateInput } from "../../utils/dateRanges";

const DAY_MS = 24 * 60 * 60 * 1000;

export const DateRangePicker = ({ start, end, onChange }) => {
  const startValue = Number(start);
  const endValue = Number(end);
  const normalizedStart = Number.isFinite(startValue)
    ? startValue
    : Number.isFinite(endValue)
    ? endValue
    : 0;
  const normalizedEnd = Number.isFinite(endValue)
    ? endValue
    : Number.isFinite(startValue)
    ? startValue
    : normalizedStart;
  const spanDays = Math.max(1, Math.floor((normalizedEnd - normalizedStart) / DAY_MS) + 1);

  const handleStartChange = (value) => {
    const nextStart = parseDateInput(value, start);
    const nextEnd = Math.max(nextStart, normalizedEnd);
    onChange?.(nextStart, nextEnd);
  };

  const handleEndChange = (value) => {
    const nextEnd = parseDateInput(value, end);
    const nextStart = Math.min(normalizedStart, nextEnd);
    onChange?.(nextStart, nextEnd);
  };

  const applyCurrentMonth = () => {
    const range = getCurrentMonthRange();
    onChange?.(range.start, range.end);
  };

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 10,
        background: "var(--bg)",
        padding: 10,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <CalendarDays size={14} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>Период</span>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--text-secondary)",
              padding: "0 8px",
              height: 24,
              borderRadius: 999,
              border: "1px solid var(--border)",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {spanDays} дн.
          </span>

          <button onClick={applyCurrentMonth} style={resetBtnStyle}>
            <RotateCcw size={12} />
            Текущий месяц
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
          С
          <input
            type="date"
            value={formatDateInput(start)}
            onChange={(event) => handleStartChange(event.target.value)}
            style={inputStyle}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
          По
          <input
            type="date"
            value={formatDateInput(end)}
            onChange={(event) => handleEndChange(event.target.value)}
            style={inputStyle}
          />
        </label>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  height: 34,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  padding: "0 8px",
  fontSize: 12,
  outline: "none",
};

const resetBtnStyle = {
  height: 28,
  borderRadius: 7,
  border: "1px solid var(--border)",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "0 8px",
  fontSize: 11,
  fontWeight: 600,
};
