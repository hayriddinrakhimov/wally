import { useState } from "react";
import { Header } from "./components/Header";
import { MainContent } from "./components/MainContent";
import { Navbar } from "./components/Navbar";
import { BottomSheet } from "./components/BottomSheet";

import { SettingsContent } from "./components/SettingsContent";
import { NotificationsContent } from "./components/NotificationsContent";
import { TransactionContent } from "./components/TransactionContent";

export default function App() {
  const [activeTab, setActiveTab] = useState("wallet");
  const [sheetType, setSheetType] = useState(null);

  const [accounts, setAccounts] = useState([
    { id: "cash", name: "Наличные", balance: 0 },
    { id: "card", name: "Карта", balance: 0 },
    { id: "deposit", name: "Депозит", balance: 0 },
  ]);

  // 🔥 главный контроллер активного счета
  const [activeIndex, setActiveIndex] = useState(0);

  const [transactions, setTransactions] = useState([]);

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
        onAdd={() => setSheetType("addAccount")}
      />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSheet={(type) => setSheetType(type)}
      />

      <BottomSheet
        open={!!sheetType}
        onClose={() => setSheetType(null)}
        title={
          sheetType === "settings"
            ? "Настройки"
            : sheetType === "notifications"
            ? "Уведомления"
            : sheetType === "add"
            ? "Транзакция"
            : "Добавить счет"
        }
      >
        {sheetType === "settings" && (
          <SettingsContent onOpenColorPicker={() => {}} />
        )}

        {sheetType === "notifications" && (
          <NotificationsContent />
        )}

        {sheetType === "add" && (
          <TransactionContent
            accounts={accounts}
            onSubmit={(tx) => {
              addTransaction(tx);
              setSheetType(null);
            }}
          />
        )}

        {sheetType === "addAccount" && (
          <div style={{ padding: 16 }}>Добавление счета (заглушка)</div>
        )}
      </BottomSheet>
    </>
  );
}