import { AccountsStack } from "./AccountsStack";
import { CurrencyWidget } from "./CurrencyWidget";
import { TransactionsList } from "./TransactionsList";
import { Plus } from "lucide-react";

export const MainContent = ({
  accounts,
  activeIndex,
  setActiveIndex,
  onAdd,
  onEdit,
  onOpenCurrency,
  onTransactionPress,
  transactions = [],
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* ================= ACCOUNTS ================= */}
      <div style={{ flexShrink: 0, marginBottom: 6 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            marginBottom: 2,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Счета
            </div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>
              Балансы и управление
            </div>
          </div>

          <button
            onClick={onAdd}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: "1px solid var(--primary)",
              background: "transparent",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Plus size={18} />
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <AccountsStack
            accounts={accounts}
            index={activeIndex}
            setIndex={setActiveIndex}
            onEdit={onEdit}
            onAdd={onAdd}
          />
        </div>
      </div>

      {/* ================= CURRENCY ================= */}
      <div style={{ flexShrink: 0, marginBottom: 8 }}>
        <CurrencyWidget onOpen={onOpenCurrency} />
      </div>

      {/* ================= TRANSACTIONS HEADER ================= */}
      <div style={{ flexShrink: 0, marginBottom: 6 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            marginBottom: 4,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              История
            </div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>
              Все операции
            </div>
          </div>
        </div>
      </div>

      {/* ================= TRANSACTIONS LIST ================= */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <div
          style={{
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: 80, // важно под navbar
          }}
        >
          <TransactionsList
            transactions={transactions}
            accounts={accounts}
            onPress={onTransactionPress}
          />
        </div>
      </div>
    </div>
  );
};
