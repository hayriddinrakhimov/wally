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
        overflow: "hidden", // ✅ ГЛАВНЫЙ ФИКС
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 1, // ✅ чтобы занял всё доступное
          display: "flex",
          alignItems: "center", // можно убрать если не хочешь центр
          justifyContent: "center",
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
          />
        </div>
      </div>

      <div style={{ height: 16, flexShrink: 0 }} />
    </div>
  );
};