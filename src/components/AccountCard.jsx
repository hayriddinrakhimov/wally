import { Pencil } from "lucide-react";
import { useCurrency } from "../context/useCurrency";
import { formatMoneySmart } from "../utils/formatMoney";

const gradients = {
  blue: "linear-gradient(135deg, #3b82f6, #1e293b)",
  green: "linear-gradient(135deg, #22c55e, #1e293b)",
  purple: "linear-gradient(135deg, #a855f7, #1e293b)",
  orange: "linear-gradient(135deg, #f97316, #1e293b)",
  red: "linear-gradient(135deg, #ef4444, #1e293b)",
  pink: "linear-gradient(135deg, #ec4899, #1e293b)",
  cyan: "linear-gradient(135deg, #06b6d4, #1e293b)",
  yellow: "linear-gradient(135deg, #eab308, #1e293b)",
  indigo: "linear-gradient(135deg, #6366f1, #1e293b)",
  teal: "linear-gradient(135deg, #14b8a6, #1e293b)",
};

export const AccountCard = ({ account, onEdit, isActive = false }) => {
  const { convert, baseCurrency } = useCurrency();

  const bg = gradients[account.color] || gradients.blue;
  const amountLabel = formatMoneySmart(account.balance, account.currency || "KZT");
  const converted = convert(account.balance, account.currency, baseCurrency);
  const showConverted = account.currency !== baseCurrency;
  const amountLength = amountLabel.length;
  const amountFontSize = amountLength > 16 ? 22 : amountLength > 12 ? 24 : 28;

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1.6 / 1",
        borderRadius: 20,
        padding: 18,
        background: bg,
        color: "white",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: isActive
          ? "1px solid rgba(255,255,255,0.35)"
          : "1px solid transparent",
        boxShadow: isActive ? "0 10px 24px rgba(15, 23, 42, 0.28)" : "none",
      }}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEdit?.(account);
        }}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 32,
          height: 32,
          borderRadius: 10,
          background: "rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
          color: "white",
        }}
      >
        <Pencil size={16} />
      </button>

      <div>
        <div style={{ opacity: 0.9, fontSize: 13, lineHeight: 1.25 }}>
          {account.name} • {account.currency}
        </div>

        <div
          style={{
            fontSize: amountFontSize,
            fontWeight: 700,
            marginTop: 8,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {amountLabel}
        </div>

        {showConverted && (
          <div style={{ marginTop: 4, fontSize: 12, opacity: 0.85 }}>
            ≈ {formatMoneySmart(converted, baseCurrency)}
          </div>
        )}
      </div>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        {account.type === "card"
          ? "**** 1234"
          : account.type === "deposit"
          ? "Депозит"
          : "Наличные"}
      </div>
    </div>
  );
};
