import { Plus } from "lucide-react";

export const AddAccountCard = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        height: 160,
        borderRadius: 20,
        padding: 18,

        // ❗ убираем серый фон
        background: "transparent",

        // ✅ делаем акцент через бордер
        border: "2px dashed var(--primary)",

        // цвет под тему
        color: "var(--primary)",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,

        cursor: "pointer",
        userSelect: "none",

        // 💡 легкий hover (если добавишь потом)
        transition: "0.2s ease",
      }}
    >
      <Plus size={28} />

      <div
        style={{
          fontWeight: 500,
        }}
      >
        Добавить счет
      </div>
    </div>
  );
};