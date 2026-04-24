import { useTheme } from "../theme/ThemeProvider";
import {
  Palette,
  Download,
  Upload,
  Trash2,
  DollarSign,
} from "lucide-react";

export const SettingsContent = ({
  onOpenColorPicker,
  baseCurrency,
  onChangeCurrency,
}) => {
  const theme = useTheme();
  const primary = theme.colors.primary;

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* ===== ВНЕШНИЙ ВИД ===== */}
      <SectionTitle>Внешний вид</SectionTitle>

      <Block>
        <Row
          icon={<Palette size={18} />}
          title="Основной цвет"
          subtitle="Меняет цвет приложения"
          right={<ColorDot color={primary} />}
          onClick={onOpenColorPicker}
        />
      </Block>

      {/* ===== ВАЛЮТА ===== */}
      <SectionTitle>Валюта</SectionTitle>

      <Block>
        <Row
          icon={<DollarSign size={18} />}
          title="Основная валюта"
          subtitle="Используется для общего баланса"
          right={
            <CurrencySelect
              value={baseCurrency}
              onChange={onChangeCurrency}
            />
          }
        />
      </Block>

      {/* ===== ДАННЫЕ ===== */}
      <SectionTitle>Данные и импорт</SectionTitle>

      <Block>
        <Row
          icon={<Download size={18} />}
          title="Экспорт данных"
          subtitle="Скачать JSON файл"
        />
        <Divider />
        <Row
          icon={<Upload size={18} />}
          title="Импорт данных"
          subtitle="Загрузить JSON"
        />
      </Block>

      {/* ===== ОПАСНО ===== */}
      <SectionTitle>Опасные действия</SectionTitle>

      <Block>
        <Row
          icon={<Trash2 size={18} />}
          title="Удалить все данные"
          subtitle="Полный сброс приложения"
          danger
        />
      </Block>

      {/* ===== О ПРИЛОЖЕНИИ ===== */}
      <SectionTitle>О приложении</SectionTitle>

      <Block>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.md,
            padding: theme.spacing.lg,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: primary,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              fontSize: 18,
            }}
          >
            W
          </div>

          <div>
            <div
              style={{
                color: theme.colors.text,
                fontWeight: "600",
              }}
            >
              Wally
            </div>

            <div
              style={{
                fontSize: theme.font?.subtitle || 12,
                color: theme.colors.secondaryText,
              }}
            >
              Версия 1.0.0
            </div>
          </div>
        </div>
      </Block>
    </div>
  );
};

/* ===== COMPONENTS ===== */

const SectionTitle = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: theme.colors.secondaryText,
        margin: `${theme.spacing.xl}px 0 ${theme.spacing.md}px`,
        textTransform: "uppercase",
        letterSpacing: 0.6,
      }}
    >
      {children}
    </div>
  );
};

const Block = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        borderRadius: theme.radius.lg,
        overflow: "hidden",
        background: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        marginBottom: theme.spacing.md,
      }}
    >
      {children}
    </div>
  );
};

const Row = ({ icon, title, subtitle, right, onClick, danger }) => {
  const theme = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
        paddingRight: theme.spacing.lg,
        paddingLeft: onClick
          ? theme.spacing.lg - 3
          : theme.spacing.lg,

        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s ease",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: danger
              ? "rgba(239,68,68,0.1)"
              : "rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: danger
              ? theme.colors.danger
              : theme.colors.text,
          }}
        >
          {icon}
        </div>

        <div>
          <div
            style={{
              color: danger
                ? theme.colors.danger
                : theme.colors.text,
              fontWeight: "500",
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: theme.font?.subtitle || 12,
                color: theme.colors.secondaryText,
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      {right}
    </div>
  );
};

const Divider = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        height: 1,
        background: theme.colors.border,
        marginLeft: 56,
      }}
    />
  );
};

const ColorDot = ({ color }) => (
  <div
    style={{
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: color,
      border: "2px solid white",
      boxShadow: "0 0 0 2px rgba(0,0,0,0.05)",
    }}
  />
);

/* 🆕 DROPDOWN ВАЛЮТЫ */
const CurrencySelect = ({ value, onChange }) => {
  const theme = useTheme();
  const currencies = ["KZT", "USD", "EUR", "RUB"];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.background,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        outline: "none",
      }}
    >
      {currencies.map((cur) => (
        <option key={cur} value={cur}>
          {cur}
        </option>
      ))}
    </select>
  );
};