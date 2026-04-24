import { AccountsStack } from "./AccountsStack";

export const MainContent = ({
  accounts,
  activeIndex,
  setActiveIndex,
  onAdd,
  onEdit, // 🔥 добавили
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "flex-start", // 🔥 фикс пустоты
          justifyContent: "center",
          paddingTop: 0, // 🔥 аккуратный отступ
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
            onEdit={onEdit} // 🔥 теперь дойдёт до карточки
          />
        </div>
      </div>

      <div style={{ height: 16, flexShrink: 0 }} />
    </div>
  );
};