import { useState } from "react";

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

  const [accounts, setAccounts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transactions, setTransactions] = useState([]);

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
    <>
      <Header
        onOpenSettings={() => setSheetType("settings")}
        onOpenNotifications={() => setSheetType("notifications")}
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
        {/* ===== НАСТРОЙКИ ===== */}
        {sheetType === "settings" && (
          <SettingsContent onOpenColorPicker={() => {}} />
        )}

        {/* ===== УВЕДОМЛЕНИЯ ===== */}
        {sheetType === "notifications" && <NotificationsContent />}

        {/* ===== ТРАНЗАКЦИЯ ===== */}
        {sheetType === "add" && (
          <TransactionContent
            accounts={accounts}
            onSubmit={(tx) => {
              addTransaction(tx);
              setSheetType(null);
            }}
          />
        )}

        {/* ===== СЧЕТ ===== */}
        {sheetType === "account" && (
          <AccountFormContent
            account={editingAccount}
            color={accountColor}
            onOpenColorPicker={() => setSheetType("accountColor")}
            onSave={handleSaveAccount}
          />
        )}

        {/* ===== ЦВЕТ СЧЕТА ===== */}
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
    </>
  );
}