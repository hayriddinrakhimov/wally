import { useTheme } from "../theme/ThemeProvider";

export const SettingsContent = ({ onOpenColorPicker }) => {
  const theme = useTheme();
  const primary = theme.colors.primary; // ✅ ВСЕГДА отсюда

  return (
    <div>
      {/* ===== ВНЕШНИЙ ВИД ===== */}
      <SectionTitle>Внешний вид</SectionTitle>

      <Block>
        <Row
          title="Основной цвет"
          subtitle="Меняет цвет приложения"
          right={<ColorDot color={primary} />}
          onClick={onOpenColorPicker}
        />
      </Block>

      {/* ===== ФИНАНСЫ ===== */}
      <SectionTitle>Финансы</SectionTitle>

      <Block>
        <Row
          title="Добавить счет"
          subtitle="Создать новый счет"
        />
      </Block>

      {/* ===== ДАННЫЕ ===== */}
      <SectionTitle>Данные</SectionTitle>

      <Block>
        <Row
          title="Экспорт данных"
          subtitle="Скачать JSON файл"
        />
        <Divider />
        <Row
          title="Импорт данных"
          subtitle="Загрузить JSON"
        />
      </Block>

      {/* ===== ОПАСНО ===== */}
      <SectionTitle>Опасные действия</SectionTitle>

      <Block>
        <Row
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
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: primary,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
            }}
          >
            W
          </div>

          <div>
            <div
              style={{
                color: theme.colors.text,
                fontWeight: "500",
              }}
            >
              Wally
            </div>

            <div
              style={{
                fontSize: theme.font.subtitle,
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

/* ===== КОМПОНЕНТЫ ===== */

const SectionTitle = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        fontSize: theme.font.subtitle,
        color: theme.colors.secondaryText,
        margin: `${theme.spacing.lg} 0 ${theme.spacing.sm}`,
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
        borderRadius: theme.radius.md,
        overflow: "hidden",
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {children}
    </div>
  );
};

const Row = ({ title, subtitle, right, onClick, danger }) => {
  const theme = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: theme.spacing.lg,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.1s ease",
      }}
      onMouseDown={(e) =>
        (e.currentTarget.style.transform = "scale(0.98)")
      }
      onMouseUp={(e) =>
        (e.currentTarget.style.transform = "scale(1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "scale(1)")
      }
    >
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
              fontSize: theme.font.subtitle,
              color: theme.colors.secondaryText,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {right}
    </div>
  );
};

const Divider = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        height: "1px",
        background: theme.colors.border,
        marginLeft: theme.spacing.lg,
      }}
    />
  );
};

const ColorDot = ({ color }) => (
  <div
    style={{
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      background: color,
      border: "2px solid white",
    }}
  />
);