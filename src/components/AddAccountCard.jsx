import { Plus } from "lucide-react";

export const AddAccountCard = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        minWidth: 260,
        height: 140,

        borderRadius: 18,
        border: "1px dashed var(--primary)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        cursor: "pointer",
        userSelect: "none",

        color: "var(--primary)",
        background: "transparent",

        opacity: 0.85,
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.transform = "scale(1.01)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0.85";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: "1px solid var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={18} />
        </div>

        <span style={{ fontSize: 12, fontWeight: 600 }}>
          Добавить счет
        </span>
      </div>
    </div>
  );
};