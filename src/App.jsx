import { useState } from "react";
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

export default function App() {
  const [activeTab, setActiveTab] = useState("wallet");
  const [sheetType, setSheetType] = useState(null);

  // 🔥 ВОТ ТУТ МАГИЯ — заменили только это
  const [accounts, setAccounts] = useLocalStorage("accounts", []);
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [activeIndex, setActiveIndex] = useLocalStorage("activeIndex", 0);

  // редактирование счета
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
  }

  /* ===================== СЧЕТА ===================== */

  function handleSaveAccount(data) {
    if (editingAccount) {
      // редактирование
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingAccount.id
            ? { ...acc, ...data, color: accountColor }
            : acc
        )
      );
    } else {
      // создание
      setAccounts((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          balance: 0,
          ...data,
          color: accountColor,
        },
      ]);
    }

    setSheetType(null);
    setEditingAccount(null);
  }

  /* ===================== UI ===================== */

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <Header
        onOpenSettings={() => setSheetType("settings")}
        onOpenNotifications={() => setSheetType("notifications")}
        disabled={!!sheetType}
      />

      {/* ===== ОСНОВНОЙ КОНТЕНТ ===== */}
      <div
        style={{
          paddingTop: 80,
        }}
      >
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

      {/* ===== BOTTOM SHEET ===== */}
      <BottomSheet
        open={!!sheetType}
        onClose={() => {
          setSheetType(null);
          setEditingAccount(null);
        }}
        title={
          sheetType === "settings"
            ? "Настройки"
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
      >
        {sheetType === "settings" && (
          <SettingsContent onOpenColorPicker={() => {}} />
        )}

        {sheetType === "notifications" && <NotificationsContent />}

        {sheetType === "add" && (
          <TransactionContent
            accounts={accounts}
            onSubmit={(tx) => {
              addTransaction(tx);
              setSheetType(null);
            }}
          />
        )}

        {sheetType === "account" && (
          <AccountFormContent
            account={editingAccount}
            color={accountColor}
            onOpenColorPicker={() => setSheetType("accountColor")}
            onSave={handleSaveAccount}
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