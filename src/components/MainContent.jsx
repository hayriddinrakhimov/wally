import { AccountsStack } from "./AccountsStack";
import { CurrencyWidget } from "./CurrencyWidget";

export const MainContent = ({
  accounts,
  activeIndex,
  setActiveIndex,
  onAdd,
  onEdit,
  onOpenCurrency,
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",

        // ⭐ ВАЖНО: безопасная зона под navbar
        paddingBottom: 80, // подгони под высоту navbar (обычно 64–80)
      }}
    >
      {/* ACCOUNTS */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 0,
        }}
      >
        <div
          style={{
            overflow: "hidden",
            width: "100%",
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
      </div>

      {/* CURRENCY WIDGET */}
      <CurrencyWidget onOpen={onOpenCurrency} />
    </div>
  );
};