import { useTheme } from "../theme/useTheme";
import { Palette, Download, Upload, Trash2 } from "lucide-react";

export const SettingsContent = ({ onOpenColorPicker }) => {
  const theme = useTheme();
  const primary = theme.colors.primary;

  return (
    <div style={{ paddingBottom: 32 }}>
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

      <SectionTitle>Данные и импорт</SectionTitle>

      <Block>
        <Row icon={<Download size={18} />} title="Экспорт данных" />
        <Divider />
        <Row icon={<Upload size={18} />} title="Импорт данных" />
      </Block>

      <SectionTitle>Опасные действия</SectionTitle>

      <Block>
        <Row icon={<Trash2 size={18} />} title="Удалить все данные" danger />
      </Block>
    </div>
  );
};

const SectionTitle = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: theme.colors.secondaryText,
        margin: "20px 0 10px",
        textTransform: "uppercase",
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
        borderRadius: 14,
        overflow: "hidden",
        background: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        marginBottom: 10,
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
        justifyContent: "space-between",
        padding: 14,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {icon}
        <div>
          <div
            style={{
              fontWeight: 600,
              color: danger ? theme.colors.danger : "",
            }}
          >
            {title}
          </div>
          {subtitle && <div style={{ fontSize: 12, opacity: 0.6 }}>{subtitle}</div>}
        </div>
      </div>

      {right}
    </div>
  );
};

const Divider = () => {
  const theme = useTheme();
  return <div style={{ height: 1, background: theme.colors.border }} />;
};

const ColorDot = ({ color }) => (
  <div
    style={{
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: color,
    }}
  />
);
