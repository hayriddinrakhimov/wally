// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const AddAccountCard = ({
  onClick,
  compact = false,
  title = "Добавить счет",
  subtitle = "Создать новый баланс",
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01, opacity: 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.16 }}
      style={{
        width: "100%",
        maxWidth: compact ? 260 : 320,
        minHeight: compact ? 132 : 154,
        borderRadius: 20,
        border: "1px dashed var(--primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        color: "var(--primary)",
        background: "var(--bg-secondary, #f8fafc)",
        opacity: 0.9,
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            border: "1px solid var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(59, 130, 246, 0.08)",
          }}
        >
          <Plus size={18} />
        </div>

        <span style={{ fontSize: 13, fontWeight: 700 }}>{title}</span>
        <span style={{ fontSize: 11, opacity: 0.75 }}>{subtitle}</span>
      </div>
    </motion.button>
  );
};

export { AddAccountCard };
export default AddAccountCard;
