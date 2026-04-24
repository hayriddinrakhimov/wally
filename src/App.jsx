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
import { ColorPickerContent } from "./components/ColorPickerContent";

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

  /* ===================== НОРМАЛИЗАЦИЯ ===================== */

  const normalizeCurrency = (cur) => {
    if (!cur) return "KZT";
    if (cur === "₸") return "KZT";
    if (cur === "$") return "USD";
    if (cur === "€") return "EUR";
    if (cur === "₽") return "RUB";
    return cur;
  };

  const accounts = Array.isArray(accountsRaw)
    ? accountsRaw.map((acc) => ({
        ...acc,
        currency: normalizeCurrency(acc.currency),
      }))
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
            }
          : acc
      )
    );

    setSheetType(null);
    setEditingAccount(null);
  }

  function handleCreateAccount(data) {
    setAccounts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        balance: 0,
        currency: normalizeCurrency(data.currency),
        ...data,
        color: accountColor,
      },
    ]);

    setSheetType(null);
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

        <div style={{ paddingTop: 80 }}>
          <TotalBalance
            accounts={accounts}
            baseCurrency={baseCurrency}
          />

          <MainContent
            accounts={accounts}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onAdd={() => {
              setEditingAccount(null);
              setAccountColor("blue");
              setSheetType("account");
            }}
            onEdit={(acc) => {
              setEditingAccount(acc);
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
            setSettingsView("main");
          }}
          title=""
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
              account={editingAccount}
              color={accountColor}
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
              onChange={(c) => {
                setAccountColor(c);
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