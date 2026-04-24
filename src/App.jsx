import { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";

import { Header } from "./components/Header";
import { MainContent } from "./components/MainContent";
import { Navbar } from "./components/Navbar";
import { BottomSheet } from "./components/BottomSheet";
import { TotalBalance } from "./components/TotalBalance";

import { SettingsContent } from "./components/SettingsContent";
import { NotificationsContent } from "./components/NotificationsContent";
import { TransactionContent } from "./components/TransactionContent";
import { AccountFormContent } from "./components/AccountFormContent";
import { AccountColorPickerContent } from "./components/AccountColorPickerContent";

import { useSetPrimary } from "./theme/ThemeProvider";
import { CurrencyProvider } from "./context/CurrencyProvider";

export default function App() {
  const [activeTab, setActiveTab] = useState("wallet");
  const [sheetType, setSheetType] = useState(null);

  const setPrimary = useSetPrimary();
  const [primaryKey, setPrimaryKey] = useLocalStorage("primaryColor", "blue");

  useEffect(() => {
    setPrimary(primaryKey);
  }, [primaryKey]);

  const [settingsView, setSettingsView] = useState("main");

  const [baseCurrency, setBaseCurrency] = useLocalStorage("baseCurrency", "KZT");

  const [accountsRaw, setAccounts] = useLocalStorage("accounts", []);
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [activeIndex, setActiveIndex] = useLocalStorage("activeIndex", 0);

  const [editingAccount, setEditingAccount] = useState(null);
  const [accountColor, setAccountColor] = useState("blue");

  // 🔥 главное — draft формы
  const [accountDraft, setAccountDraft] = useState(null);

  /* ===================== COLORS ===================== */

  const ALL_COLORS = [
    "blue",
    "green",
    "purple",
    "orange",
    "red",
    "pink",
    "cyan",
    "yellow",
    "indigo",
    "teal",
  ];

  const getFreeColor = (used) => {
    return ALL_COLORS.find((c) => !used.includes(c)) || "blue";
  };

  /* ===================== ДЕФОЛТНЫЕ СЧЕТА ===================== */

  useEffect(() => {
    if (!accountsRaw || accountsRaw.length === 0) {
      const defaults = [
        {
          id: "cash",
          name: "Наличные",
          balance: 0,
          currency: "KZT",
          color: "green",
          type: "cash",
        },
        {
          id: "card-1",
          name: "Счет №1",
          balance: 0,
          currency: "KZT",
          color: "blue",
          type: "card",
        },
        {
          id: "deposit",
          name: "Депозит",
          balance: 0,
          currency: "KZT",
          color: "purple",
          type: "deposit",
        },
      ];

      setAccounts(defaults);
    }
  }, [accountsRaw, setAccounts]);

  /* ===================== ФИКС ИНДЕКСА ===================== */

  useEffect(() => {
    const itemsLength = (accountsRaw?.length || 0) + 1;

    if (activeIndex >= itemsLength) {
      setActiveIndex(itemsLength - 1);
    }

    if (activeIndex < 0) {
      setActiveIndex(0);
    }
  }, [accountsRaw, activeIndex, setActiveIndex]);

  /* ===================== НОРМАЛИЗАЦИЯ ===================== */

  const normalizeCurrency = (cur) => {
    if (!cur) return "KZT";
    if (cur === "₸") return "KZT";
    if (cur === "$") return "USD";
    if (cur === "€") return "EUR";
    if (cur === "₽") return "RUB";
    return cur;
  };

  /* ===================== СОРТИРОВКА ===================== */

  const typeOrder = {
    cash: 0,
    card: 1,
    deposit: 2,
  };

  const accounts = Array.isArray(accountsRaw)
    ? accountsRaw
        .map((acc) => ({
          ...acc,
          currency: normalizeCurrency(acc.currency),
          type: acc.type || "card",
        }))
        .sort((a, b) => typeOrder[a.type] - typeOrder[b.type])
    : [];

  /* ===================== ТРАНЗАКЦИИ ===================== */

  function applyTransaction(prevAccounts, tx) {
    return prevAccounts.map((acc) => {
      if (tx.type === "income" && acc.id === tx.to) {
        return { ...acc, balance: acc.balance + tx.amount };
      }

      if (tx.type === "expense" && acc.id === tx.from) {
        return { ...acc, balance: acc.balance - tx.amount };
      }

      if (tx.type === "transfer") {
        if (acc.id === tx.from) {
          return { ...acc, balance: acc.balance - tx.amount };
        }
        if (acc.id === tx.to) {
          return { ...acc, balance: acc.balance + tx.amount };
        }
      }

      return acc;
    });
  }

  function addTransaction(tx) {
    setTransactions((prev) => [tx, ...prev]);
    setAccounts((prev) => applyTransaction(prev, tx));
    setSheetType(null);
  }

  /* ===================== СЧЕТА ===================== */

  function handleSaveAccount(data) {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === data.id
          ? {
              ...acc,
              ...data,
              currency: normalizeCurrency(data.currency),
              type: data.type || acc.type || "card",
            }
          : acc
      )
    );

    setSheetType(null);
    setEditingAccount(null);
    setAccountDraft(null);
  }

  function handleCreateAccount(data) {
    setAccounts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        balance: 0,
        currency: normalizeCurrency(data.currency),
        ...data,
        type: data.type || "card",
        color: data.color || accountColor,
      },
    ]);

    setSheetType(null);
    setAccountDraft(null);
  }

  /* ===================== FOOTER ===================== */

  const renderFooter = () => {
    if (sheetType === "add") {
      return (
        <button
          style={btnStyle}
          onClick={() =>
            document.dispatchEvent(new Event("submitTransaction"))
          }
        >
          Сохранить
        </button>
      );
    }

    if (sheetType === "account") {
      return (
        <button
          style={btnStyle}
          onClick={() =>
            document.dispatchEvent(new Event("submitAccount"))
          }
        >
          {editingAccount ? "Сохранить" : "Создать"}
        </button>
      );
    }

    return null;
  };

  /* ===================== UI ===================== */

  return (
    <CurrencyProvider baseCurrency={baseCurrency}>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Header
          onOpenSettings={() => {
            setSheetType("settings");
            setSettingsView("main");
          }}
          onOpenNotifications={() => setSheetType("notifications")}
          disabled={!!sheetType}
        />

        <div style={{ paddingTop: 8 }}>
          <TotalBalance
            accounts={accounts}
            baseCurrency={baseCurrency}
          />

          <MainContent
            accounts={accounts}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onAdd={() => {
              const used = accountsRaw
                .map((a) => a.color)
                .filter(Boolean);

              const color = getFreeColor(used);

              setEditingAccount(null);

              setAccountDraft({
                name: "",
                currency: "KZT",
                type: "card",
                color,
              });

              setAccountColor(color);
              setSheetType("account");
            }}
            onEdit={(acc) => {
              setEditingAccount(acc);

              setAccountDraft({ ...acc });

              setAccountColor(acc.color || "blue");
              setSheetType("account");
            }}
          />

          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSheet={(type) => setSheetType(type)}
          />
        </div>

        <BottomSheet
          open={!!sheetType}
          onClose={() => {
            setSheetType(null);
            setEditingAccount(null);
            setAccountDraft(null);
            setSettingsView("main");
          }}
          title={
            sheetType === "account"
              ? editingAccount
                ? "Редактировать счет"
                : "Новый счет"
              : ""
          }
          footer={renderFooter()}
        >
          {sheetType === "settings" && (
            <SettingsContent
              baseCurrency={baseCurrency}
              onChangeCurrency={setBaseCurrency}
              onOpenColorPicker={() => setSettingsView("color")}
            />
          )}

          {sheetType === "notifications" && <NotificationsContent />}

          {sheetType === "add" && (
            <TransactionContent
              accounts={accounts}
              onSubmit={addTransaction}
            />
          )}

          {sheetType === "account" && (
            <AccountFormContent
              account={accountDraft}
              color={accountColor}
              usedColors={
                accountsRaw
                  .filter((a) => a.id !== editingAccount?.id)
                  .map((a) => a.color)
                  .filter(Boolean)
              }
              onChange={setAccountDraft}
              onOpenColorPicker={() =>
                setSheetType("accountColor")
              }
              onSave={(data) => {
                if (editingAccount) {
                  handleSaveAccount(data);
                } else {
                  handleCreateAccount(data);
                }
              }}
            />
          )}

          {sheetType === "accountColor" && (
            <AccountColorPickerContent
              value={accountColor}
              usedColors={
                accountsRaw
                  .filter((a) => a.id !== editingAccount?.id)
                  .map((a) => a.color)
                  .filter(Boolean)
              }
              onChange={(c) => {
                setAccountColor(c);

                // 🔥 синхронизация с draft
                setAccountDraft((prev) => ({
                  ...prev,
                  color: c,
                }));

                setSheetType("account");
              }}
            />
          )}
        </BottomSheet>
      </div>
    </CurrencyProvider>
  );
}

const btnStyle = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  background: "var(--primary)",
  color: "white",
  border: "none",
  fontWeight: 600,
};