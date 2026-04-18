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
        padding: 16,
        marginTop: 10,
      }}
    >
      <AccountsStack
        accounts={accounts}
        index={activeIndex}
        setIndex={setActiveIndex}
      />

      <button
        onClick={onAdd}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 12,
          borderRadius: 12,
          border: "none",
          background: "black",
          color: "white",
          fontSize: 14,
        }}
      >
        + Добавить счет
      </button>
    </div>
  );
};