import { Plus } from "lucide-react";

export const AddAccountCard = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        height: 160,
        borderRadius: 20,
        padding: 18,

        background: "#f3f4f6",
        color: "#111",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,

        cursor: "pointer",
        userSelect: "none",
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