import { motion as Motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

const TONE_MAP = {
  green: {
    iconBg: "rgba(22, 163, 74, 0.16)",
    iconColor: "#166534",
    trendUp: "#166534",
    trendDown: "#b91c1c",
    bg: "linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)",
    border: "rgba(134, 239, 172, 0.7)",
  },
  red: {
    iconBg: "rgba(239, 68, 68, 0.16)",
    iconColor: "#b91c1c",
    trendUp: "#166534",
    trendDown: "#b91c1c",
    bg: "linear-gradient(145deg, #ffffff 0%, #fef2f2 100%)",
    border: "rgba(252, 165, 165, 0.65)",
  },
  purple: {
    iconBg: "rgba(37, 99, 235, 0.16)",
    iconColor: "#1d4ed8",
    trendUp: "#166534",
    trendDown: "#b91c1c",
    bg: "linear-gradient(145deg, #ffffff 0%, #eff6ff 100%)",
    border: "rgba(147, 197, 253, 0.65)",
  },
  neutral: {
    iconBg: "rgba(148, 163, 184, 0.18)",
    iconColor: "#334155",
    trendUp: "#166534",
    trendDown: "#b91c1c",
    bg: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
    border: "rgba(203, 213, 225, 0.85)",
  },
};

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend = null,
  tone = "neutral",
}) => {
  const trendUp = trend !== null && trend >= 0;
  const palette = TONE_MAP[tone] || TONE_MAP.neutral;
  const valueSize = String(value || "").length > 14 ? 13 : 15;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        background: palette.bg,
        padding: 10,
        boxShadow: "0 8px 18px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          gap: 6,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 8,
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
          <span
            style={{
              fontSize: 11,
              color: "#64748b",
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </span>
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
              padding: "2px 6px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(148, 163, 184, 0.24)",
            }}
          >
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendUp ? "+" : "-"}
            {Math.abs(Math.round(trend))}%
          </div>
        )}
      </div>

      <div
        style={{
          fontSize: valueSize,
          fontWeight: 800,
          lineHeight: 1.25,
          color: "#0f172a",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </div>
    </Motion.div>
  );
};
