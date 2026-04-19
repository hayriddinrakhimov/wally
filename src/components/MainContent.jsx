import { AccountsStack } from "./AccountsStack";

export const MainContent = ({
  accounts,
  activeIndex,
  setActiveIndex,
  onAdd,
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative" }}>
        <div style={{ overflow: "hidden" }}>
          <AccountsStack
            accounts={accounts}
            index={activeIndex} // ✅ фикс
            setIndex={setActiveIndex}
            onAdd={onAdd}
          />
        </div>
      </div>

      <div style={{ height: 16 }} />
    </div>
  );
};