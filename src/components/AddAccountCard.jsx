import { Plus } from "lucide-react";

export const AddAccountCard = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 42,
        borderRadius: 999,
        padding: "0 14px",
        background: "var(--primary)",
        border: "none",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        cursor: "pointer",
        userSelect: "none",
        boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
        fontWeight: 600,
        fontSize: 13,
      }}
      title="Добавить счет"
    >
      <Plus size={16} />
      <span>Добавить счет</span>
    </button>
  );
};