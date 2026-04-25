import { AccountsStack } from "./AccountsStack";
import { CurrencyWidget } from "./CurrencyWidget";
import { TransactionsList } from "./TransactionsList";

export const MainContent = ({
  accounts,
  activeIndex,
  setActiveIndex,
  onAdd,
  onEdit,
  onOpenCurrency,
  transactions = [],
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",

        // ❗ важно для flex scroll
        minHeight: 0,
      }}
    >
      {/* ================= ACCOUNTS ================= */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AccountsStack
          accounts={accounts}
          index={activeIndex}
          setIndex={setActiveIndex}
          onAdd={onAdd}
          onEdit={onEdit}
        />
      </div>

      {/* ================= CURRENCY ================= */}
      <div
        style={{
          flexShrink: 0,
          marginTop: 6,
          marginBottom: 6,
        }}
      >
        <CurrencyWidget onOpen={onOpenCurrency} />
      </div>

      {/* ================= TRANSACTIONS (SCROLL AREA) ================= */}
      <div
        style={{
          flex: 1,

          // ❗ ключевой фикс
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <TransactionsList
            transactions={transactions}
            accounts={accounts}
          />
        </div>
      </div>
    </div>
  );
};