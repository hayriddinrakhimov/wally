import { formatMoney } from "../utils/formatMoney";
import { Wallet, CreditCard, Landmark } from "lucide-react";

const gradients = {
  blue: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
  green: "linear-gradient(135deg, #22c55e 0%, #14532d 100%)",
  purple: "linear-gradient(135deg, #a855f7 0%, #581c87 100%)",
  orange: "linear-gradient(135deg, #f97316 0%, #7c2d12 100%)",
  red: "linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)",
};

export const AccountCard = ({ account, isActive }) => {
  const gradient = gradients[account.color] || gradients.blue;

  const balance = account.balance ?? 0;
  const currency = account.currency || "KZT";

  // ===== ИКОНКА СЛЕВА =====
  const getIcon = () => {
    switch (account.type) {
      case "cash":
        return <Wallet size={18} />;
      case "deposit":
        return <Landmark size={18} />;
      default:
        return <CreditCard size={18} />;
    }
  };

  // ===== ЭЛЕМЕНТ СПРАВА =====
  const getRightElement = () => {
    if (account.type === "deposit") {
      return (
        <div style={{ fontSize: 16, opacity: 0.8 }}>
          🔒
        </div>
      );
    }

    if (account.type === "cash") {
      return (
        <div style={{ fontSize: 16, opacity: 0.8 }}>
          💵
        </div>
      );
    }

    return (
      <div style={{ fontSize: 12, opacity: 0.7 }}>
        **** 1234
      </div>
    );
  };

  return (
    <div
      style={{
        height: 160,
        borderRadius: 20,
        padding: 18,

        background: gradient,
        color: "white",

        boxShadow: "none",

        transform: isActive ? "scale(1)" : "scale(0.96)",
        transition: "all 0.25s ease",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* ===== ВЕРХ ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* ЛЕВАЯ ЧАСТЬ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: 0.9,
          }}
        >
          {getIcon()}
          <span>{account.name || "Счет"}</span>
        </div>

        {/* ВАЛЮТА */}
        <div
          style={{
            fontSize: 14,
            opacity: 0.8,
          }}
        >
          {currency}
        </div>
      </div>

      {/* ===== БАЛАНС ===== */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        {formatMoney(balance, currency)}
      </div>

      {/* ===== НИЗ ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {getRightElement()}
      </div>
    </div>
  );
};