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
import { CurrencyPickerContent } from "./components/CurrencyPickerContent";

import { useSetPrimary } from "./theme/ThemeProvider";
import { CurrencyProvider, useCurrency } from "./context/CurrencyProvider";

export default function App() {
  const [activeTab, setActiveTab] = useState("wallet");
  const [sheetType, setSheetType] = useState(null);

  const setPrimary = useSetPrimary();
  const [primaryKey] = useLocalStorage("primaryColor", "blue");

  useEffect(() => {
    setPrimary(primaryKey);
  }, [primaryKey]);

  const [settingsView, setSettingsView] = useState("main");

  const [baseCurrency, setBaseCurrency] = useLocalStorage(
    "baseCurrency",
    "KZT"
  );

  const [accountsRaw, setAccounts] = useLocalStorage("accounts", []);
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [activeIndex, setActiveIndex] = useLocalStorage("activeIndex", 0);

  const [editingAccount, setEditingAccount] = useState(null);
  const [accountColor, setAccountColor] = useState("blue");
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

  const getFreeColor = (used) =>
    ALL_COLORS.find((c) => !used.includes(c)) || "blue";

  /* ===================== DEFAULT ACCOUNTS ===================== */

  useEffect(() => {
    if (!accountsRaw || accountsRaw.length === 0) {
      setAccounts([
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
      ]);
    }
  }, [accountsRaw, setAccounts]);

  /* ===================== TRANSACTIONS ===================== */

  function addTransaction(tx) {
    setTransactions((prev) => [tx, ...prev]);

    setAccounts((prev) =>
      prev.map((acc) => {
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
      })
    );

    setSheetType(null);
  }

  /* ===================== ACCOUNTS ===================== */

  function handleSaveAccount(data) {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === data.id ? { ...acc, ...data } : acc
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
        currency: "KZT",
        ...data,
        color: data.color || accountColor,
        type: data.type || "card",
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

  return (
    <CurrencyProvider baseCurrency={baseCurrency}>
      <div style={{ minHeight: "100vh" }}>
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
            accounts={accountsRaw}
            baseCurrency={baseCurrency}
          />

          <MainContent
            accounts={accountsRaw}
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
              setAccountDraft(acc);
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
          title=" "
          footer={renderFooter()}
        >
          {sheetType === "settings" && (
            <SettingsContent
              baseCurrency={baseCurrency}
              onChangeCurrency={setBaseCurrency}
              onOpenColorPicker={() => setSettingsView("color")}
            />
          )}

          {sheetType === "notifications" && (
            <NotificationsContent />
          )}

          {sheetType === "add" && (
            <TransactionContent
              accounts={accountsRaw}
              onSubmit={addTransaction}
            />
          )}

          {sheetType === "account" && (
            <AccountFormContent
              account={accountDraft}
              color={accountColor}
              onChange={setAccountDraft}
              onOpenColorPicker={() =>
                setSheetType("accountColor")
              }
              onSave={(data) =>
                editingAccount
                  ? handleSaveAccount(data)
                  : handleCreateAccount(data)
              }
            />
          )}

          {sheetType === "accountColor" && (
            <AccountColorPickerContent
              value={accountColor}
              onChange={(c) => {
                setAccountColor(c);
                setAccountDraft((p) => ({
                  ...p,
                  color: c,
                }));
                setSheetType("account");
              }}
            />
          )}

          {/* 💰 ВАЛЮТЫ */}
          {sheetType === "currency" && (
            <CurrencyPickerContent
              onClose={() => setSheetType(null)}
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