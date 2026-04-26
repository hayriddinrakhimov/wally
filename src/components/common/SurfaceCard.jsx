import { motion as Motion } from "framer-motion";

const baseStyle = {
  border: "1px solid var(--border)",
  borderRadius: 16,
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
  padding: 12,
  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
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
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay }}
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
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontWeight: 800,
              fontSize: 14,
              color: "#0f172a",
            }}
          >
            {Icon ? (
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(59, 130, 246, 0.12)",
                  color: "#1d4ed8",
                }}
              >
                <Icon size={14} />
              </span>
            ) : null}
            {title ? <span>{title}</span> : null}
          </div>
          {titleRight}
        </div>
      )}
      {children}
    </Motion.div>
  );
};
