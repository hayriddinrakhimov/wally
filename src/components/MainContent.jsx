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
        setIndex={setActiveIndex} // 👈 ЭТО КРИТИЧНО
      />

      {/* индикатор */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {accounts.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: i === activeIndex ? "#3b82f6" : "#d1d5db",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>

      <button
        onClick={onAdd}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 14,
          borderRadius: 14,
          border: "none",
          background: "black",
          color: "white",
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        + Добавить счет
      </button>
    </div>
  );
};