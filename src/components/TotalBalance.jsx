import { useCurrency } from "../context/CurrencyProvider";
import { useTheme } from "../theme/ThemeProvider";
import { formatMoney } from "../utils/formatMoney";

export const TotalBalance = ({ accounts, baseCurrency }) => {
  const { convert } = useCurrency();
  const theme = useTheme();

  const total = accounts.reduce((sum, acc) => {
    const balance =
      typeof acc.balance === "number" ? acc.balance : 0;

    const from = acc.currency || baseCurrency;

    const value = convert(balance, from, baseCurrency);

    // 🔥 защита от NaN
    if (isNaN(value)) return sum;

    return sum + value;
  }, 0);

  const safeTotal = isNaN(total) ? 0 : total;

  return (
    <div
      style={{
        padding: "16px 20px",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: theme.colors.secondaryText,
          marginBottom: 4,
        }}
      >
        Общий баланс
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: theme.colors.text,
          letterSpacing: -0.5,
        }}
      >
        {formatMoney(safeTotal, baseCurrency)}
      </div>
    </div>
  );
};