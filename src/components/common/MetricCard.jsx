// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

const TONE_MAP = {
  green: {
    iconBg: "rgba(22, 163, 74, 0.14)",
    iconColor: "#15803d",
    trendUp: "#15803d",
    trendDown: "#b91c1c",
  },
  red: {
    iconBg: "rgba(239, 68, 68, 0.14)",
    iconColor: "#b91c1c",
    trendUp: "#15803d",
    trendDown: "#b91c1c",
  },
  purple: {
    iconBg: "rgba(124, 58, 237, 0.14)",
    iconColor: "#6d28d9",
    trendUp: "#15803d",
    trendDown: "#b91c1c",
  },
  neutral: {
    iconBg: "rgba(148, 163, 184, 0.16)",
    iconColor: "#334155",
    trendUp: "#15803d",
    trendDown: "#b91c1c",
  },
};

export const MetricCard = ({ title, value, icon: Icon, trend = null, tone = "neutral" }) => {
  const trendUp = trend !== null && trend >= 0;
  const palette = TONE_MAP[tone] || TONE_MAP.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        border: "1px solid var(--border)",
        borderRadius: 10,
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))",
        padding: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: palette.iconBg,
              color: palette.iconColor,
              flexShrink: 0,
            }}
          >
            {Icon ? <Icon size={13} /> : null}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{title}</span>
        </div>

        {trend !== null && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontSize: 10,
              fontWeight: 700,
              color: trendUp ? palette.trendUp : palette.trendDown,
            }}
          >
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(Math.round(trend))}%
          </div>
        )}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{value}</div>
    </motion.div>
  );
};
