import { Plus } from "lucide-react";

export const AddAccountCard = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      style={{
        height: 160,
        borderRadius: 20,
        padding: 18,

        background: "transparent",
        border: "2px dashed var(--primary)",
        color: "var(--primary)",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,

        cursor: "pointer",
        userSelect: "none",

        transform: "scale(1)",
        transition: "all 0.2s ease",
      }}
    >
      {/* ИКОНКА */}
      <Plus size={28} />

      {/* ТЕКСТ */}
      <div
        style={{
          fontWeight: 500,
          fontSize: 14,
        }}
      >
        Добавить счет
      </div>
    </div>
  );
};