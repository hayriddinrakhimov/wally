import { useState } from "react";
import { useTheme } from "../theme/useTheme";
import { useCurrency } from "../context/useCurrency";
import {
  Palette,
  Download,
  Upload,
  Trash2,
  DollarSign,
  Check,
} from "lucide-react";

export const SettingsContent = ({ onOpenColorPicker }) => {
  const theme = useTheme();
  const primary = theme.colors.primary;

  const {
    baseCurrency,
    setBaseCurrency,
    watchlist,
    addCurrency,
    removeCurrency,
  } = useCurrency();

  const [search, setSearch] = useState("");

  const ALL_CURRENCIES = [
    "USD",
    "EUR",
    "RUB",
    "KZT",
    "KGS",
    "UZS",
    "CNY",
    "GBP",
    "TRY",
    "AED",
    "JPY",
    "CHF",
    "CAD",
    "AUD",
    "SEK",
    "NOK",
  ];

  const filteredCurrencies = ALL_CURRENCIES.filter((currency) =>
    currency.toLowerCase().includes(search.toLowerCase())
  );

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

      <SectionTitle>Валюта</SectionTitle>

      <Block>
        <Row
          icon={<DollarSign size={18} />}
          title="Основная валюта"
          subtitle={`Текущая: ${baseCurrency}`}
          right={<span style={{ fontWeight: 700 }}>{baseCurrency}</span>}
        />

        <div style={{ padding: 12 }}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск валюты..."
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: `1px solid ${theme.colors.border}`,
              outline: "none",
            }}
          />
        </div>

        <div style={{ maxHeight: 200, overflowY: "auto" }}>
          {filteredCurrencies.map((currency) => {
            const active = baseCurrency === currency;

            return (
              <div
                key={currency}
                onClick={() => setBaseCurrency(currency)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  cursor: "pointer",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600 }}>{currency}</span>

                {active && <Check size={16} color={primary} />}
              </div>
            );
          })}
        </div>
      </Block>

      <SectionTitle>Отслеживаемые валюты</SectionTitle>

      <Block>
        {watchlist.map((currency) => (
          <div
            key={currency}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 16px",
              alignItems: "center",
            }}
          >
            <span>{currency}</span>

            <button
              onClick={() => removeCurrency(currency)}
              style={{
                border: "none",
                background: "transparent",
                color: theme.colors.danger,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              удалить
            </button>
          </div>
        ))}

        <div style={{ padding: 12 }}>
          <button
            onClick={() => {
              const input = prompt("Введите валюту (USD, EUR...) ");
              if (input) addCurrency(input.toUpperCase());
            }}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px dashed " + theme.colors.border,
              background: "transparent",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Добавить валюту
          </button>
        </div>
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
          {subtitle && (
            <div style={{ fontSize: 12, opacity: 0.6 }}>{subtitle}</div>
          )}
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