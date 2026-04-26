const LEGACY_COLOR_MAP = {
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#a855f7",
  orange: "#f97316",
  red: "#ef4444",
  pink: "#ec4899",
  cyan: "#06b6d4",
  yellow: "#eab308",
  indigo: "#6366f1",
  teal: "#14b8a6",
};

const HEX_3 = /^#([a-fA-F0-9]{3})$/;
const HEX_6 = /^#([a-fA-F0-9]{6})$/;

const clampByte = (value) => Math.max(0, Math.min(255, Math.round(value)));

const expandHex = (value) => {
  const match = String(value || "").match(HEX_3);
  if (!match) return String(value || "");

  const [r, g, b] = match[1].split("");
  return `#${r}${r}${g}${g}${b}${b}`;
};

const darkenHex = (hex, factor = 0.58) => {
  const normalized = expandHex(hex);
  const match = normalized.match(HEX_6);
  if (!match) return "#1e293b";

  const raw = match[1];
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);

  const toHex = (channel) => clampByte(channel * factor).toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const normalizeColor = (value, fallback = "#3b82f6") => {
  const raw = String(value || "").trim();
  if (!raw) return fallback;

  const legacy = LEGACY_COLOR_MAP[raw.toLowerCase()];
  if (legacy) return legacy;

  const expanded = expandHex(raw);
  if (HEX_6.test(expanded)) return expanded.toLowerCase();

  return fallback;
};

export const toCardGradient = (value) => {
  const base = normalizeColor(value, "#3b82f6");
  const shade = darkenHex(base);
  return `linear-gradient(135deg, ${base}, ${shade})`;
};
