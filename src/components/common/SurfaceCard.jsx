// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const baseStyle = {
  border: "1px solid var(--border)",
  borderRadius: 10,
  background: "var(--bg)",
  padding: 12,
};

export const SurfaceCard = ({
  title = null,
  icon: Icon = null,
  titleRight = null,
  delay = 0,
  style = null,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ ...baseStyle, ...(style || {}) }}
    >
      {(title || titleRight) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
            {Icon ? <Icon size={14} /> : null}
            {title ? <span>{title}</span> : null}
          </div>
          {titleRight}
        </div>
      )}
      {children}
    </motion.div>
  );
};
