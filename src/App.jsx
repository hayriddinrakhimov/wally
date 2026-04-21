import { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";

import { Header } from "./components/Header";
import { MainContent } from "./components/MainContent";
import { Navbar } from "./components/Navbar";
import { BottomSheet } from "./components/BottomSheet";

import { SettingsContent } from "./components/SettingsContent";
import { NotificationsContent } from "./components/NotificationsContent";
import { TransactionContent } from "./components/TransactionContent";
import { AccountFormContent } from "./components/AccountFormContent";
import { AccountColorPickerContent } from "./components/AccountColorPickerContent";
import { ColorPickerContent } from "./components/ColorPickerContent";

import { useSetPrimary } from "./theme/ThemeProvider";

export default function App() {
  const [activeTab, setActiveTab] = useState("wallet");
  const [sheetType, setSheetType] = useState(null);

  const setPrimary = useSetPrimary();
  const [primaryKey, setPrimaryKey] = useLocalStorage("primaryColor", "blue");

  useEffect(() => {
    setPrimary(primaryKey);
  }, [primaryKey]);

  const [settingsView, setSettingsView] = useState("main");

  const [accounts, setAccounts] = useLocalStorage("accounts", []);
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [activeIndex, setActiveIndex] = useLocalStorage("activeIndex", 0);

  const [editingAccount, setEditingAccount] = useState(null);
  const [accountColor, setAccountColor] = useState("blue");

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
        acc.id === data.id ? { ...acc, ...data } : acc
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
        title={
          sheetType === "settings"
            ? settingsView === "main"
              ? "Настройки"
              : "Цвет приложения"
            : sheetType === "notifications"
            ? "Уведомления"
            : sheetType === "add"
            ? "Транзакция"
            : sheetType === "account"
            ? editingAccount
              ? "Редактировать счет"
              : "Добавить счет"
            : sheetType === "accountColor"
            ? "Цвет счета"
            : ""
        }
        footer={renderFooter()}
      >
        {/* SETTINGS */}
        {sheetType === "settings" && (
          <>
            {settingsView === "main" && (
              <SettingsContent
                onOpenColorPicker={() => setSettingsView("color")}
              />
            )}

            {settingsView === "color" && (
              <div>
                <div
                  onClick={() => setSettingsView("main")}
                  style={{
                    padding: 16,
                    borderBottom: "1px solid #eee",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Назад
                </div>

                <ColorPickerContent
                  value={primaryKey}
                  onChange={(color) => {
                    setPrimaryKey(color);
                    setPrimary(color);
                  }}
                />
              </div>
            )}
          </>
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
            onOpenColorPicker={() => setSheetType("accountColor")}
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
  );
}

/* ===================== STYLES ===================== */

const btnStyle = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  background: "var(--primary)",
  color: "white",
  border: "none",
  fontWeight: 600,
};