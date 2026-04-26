import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";

import { Header } from "./components/Header";
import { MainContent } from "./components/MainContent";
import { Navbar } from "./components/Navbar";
import { BottomSheet } from "./components/BottomSheet";
import { TotalBalance } from "./components/TotalBalance";

import { SettingsContent } from "./components/SettingsContent";
import { NotificationsContent } from "./components/NotificationsContent";
import { TransactionContent } from "./components/TransactionContent";
import { TransactionEditContent } from "./components/TransactionEditContent";
import { AccountFormContent } from "./components/AccountFormContent";
import { AccountColorPickerContent } from "./components/AccountColorPickerContent";
import { ColorPickerContent } from "./components/ColorPickerContent";
import { CurrencyPickerContent } from "./components/CurrencyPickerContent";

import { CurrencyProvider } from "./context/CurrencyProvider";
import { useSetPrimary } from "./theme/useTheme";

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

const getDateValue = (value) => {
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && asNumber > 0) return asNumber;

  const asDate = new Date(value).getTime();
  return Number.isFinite(asDate) ? asDate : Date.now();
};

const normalizeTransaction = (tx, fallbackId = null) => {
  if (!tx || typeof tx !== "object") return null;

  const type = ["income", "expense", "transfer"].includes(tx.type)
    ? tx.type
    : "expense";

  const amount = Number(tx.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const from = tx.from || tx.fromAccountId || "";
  const to = tx.to || tx.toAccountId || "";

  const categoryId =
    type === "transfer"
      ? "transfer"
      : tx.categoryId || tx.category || "uncategorized";

  return {
    id: String(tx.id || fallbackId || Date.now()),
    type,
    amount,
    currency: tx.currency || "KZT",
    categoryId,
    note: String(tx.note || "").trim(),
    date: getDateValue(tx.date),
    from,
    to,
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState("wallet");
  const [sheetType, setSheetType] = useState(null);
  const [sheetReturnType, setSheetReturnType] = useState(null);

  const setPrimary = useSetPrimary();
  const [primaryKey, setPrimaryKey] = useLocalStorage("primaryColor", "blue");

  useEffect(() => {
    setPrimary(primaryKey);
  }, [primaryKey, setPrimary]);

  const [accountsRaw, setAccounts] = useLocalStorage("accounts", []);
  const [transactionsRaw, setTransactions] = useLocalStorage("transactions", []);
  const [activeIndex, setActiveIndex] = useLocalStorage("activeIndex", 0);

  const [editingAccount, setEditingAccount] = useState(null);
  const [accountColor, setAccountColor] = useState("blue");
  const [accountDraft, setAccountDraft] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const accountsStore = useMemo(
    () => (Array.isArray(accountsRaw) ? accountsRaw : []),
    [accountsRaw]
  );
  const transactionsStore = useMemo(
    () => (Array.isArray(transactionsRaw) ? transactionsRaw : []),
    [transactionsRaw]
  );
  const activeIndexValue = useMemo(
    () =>
      Number.isFinite(Number(activeIndex))
        ? Number(activeIndex)
        : 0,
    [activeIndex]
  );
  useEffect(() => {
    if (accountsStore.length === 0) {
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
  }, [accountsStore.length, setAccounts]);

  const transactions = useMemo(
    () =>
      transactionsStore
        .map((tx, index) => normalizeTransaction(tx, `legacy-${index}`))
        .filter(Boolean),
    [transactionsStore]
  );

  const accounts = useMemo(() => {
    const byId = new Map(
      accountsStore.map((account) => [
        account.id,
        {
          ...account,
          balance: 0,
        },
      ])
    );

    const orderedTransactions = [...transactions].sort(
      (a, b) => a.date - b.date
    );

    orderedTransactions.forEach((tx) => {
      const amount = Number(tx.amount);
      if (!Number.isFinite(amount) || amount <= 0) return;

      if (tx.type === "expense") {
        if (byId.has(tx.from)) {
          byId.get(tx.from).balance -= amount;
        }
        return;
      }

      if (tx.type === "income") {
        if (byId.has(tx.to)) {
          byId.get(tx.to).balance += amount;
        }
        return;
      }

      if (tx.type === "transfer") {
        if (!tx.from || !tx.to || tx.from === tx.to) return;

        if (byId.has(tx.from)) {
          byId.get(tx.from).balance -= amount;
        }

        if (byId.has(tx.to)) {
          byId.get(tx.to).balance += amount;
        }
      }
    });

    return Array.from(byId.values());
  }, [accountsStore, transactions]);

  const safeActiveIndex = useMemo(() => {
    if (!accounts.length) return 0;

    const normalized = activeIndexValue % accounts.length;
    return normalized >= 0
      ? normalized
      : normalized + accounts.length;
  }, [accounts.length, activeIndexValue]);

  useEffect(() => {
    if (!accounts.length) return;
    if (safeActiveIndex !== activeIndexValue) {
      setActiveIndex(safeActiveIndex);
    }
  }, [accounts.length, safeActiveIndex, activeIndexValue, setActiveIndex]);

  const getFreeColor = useCallback((used) => {
    return ALL_COLORS.find((color) => !used.includes(color)) || "blue";
  }, []);

  const addTransaction = useCallback(
    (transactionDraft) => {
      const transaction = normalizeTransaction(transactionDraft);
      if (!transaction) return;

      setTransactions((prev) => [transaction, ...prev]);
      setSheetType(null);
      setEditingTransaction(null);
    },
    [setTransactions]
  );

  const updateTransaction = useCallback(
    (updatedDraft) => {
      const normalized = normalizeTransaction(updatedDraft, updatedDraft?.id);
      if (!normalized) return;

      setTransactions((prev) =>
        prev.map((tx) => (String(tx.id) === normalized.id ? normalized : tx))
      );
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    (id) => {
      const normalizedId = String(id);
      setTransactions((prev) =>
        prev.filter((tx) => String(tx.id) !== normalizedId)
      );
    },
    [setTransactions]
  );

  const closeSheet = useCallback(() => {
    setSheetType(null);
    setSheetReturnType(null);
    setEditingAccount(null);
    setAccountDraft(null);
    setEditingTransaction(null);
  }, []);

  const goBackToParentSheet = useCallback(() => {
    setSheetType(sheetReturnType || null);
    setSheetReturnType(null);
  }, [sheetReturnType]);

  const openNestedSheet = useCallback((nextSheet, returnSheet) => {
    setSheetReturnType(returnSheet);
    setSheetType(nextSheet);
  }, []);

  const openCreateAccount = useCallback(() => {
    const usedColors = accountsStore
      .map((account) => account.color)
      .filter(Boolean);
    const color = getFreeColor(usedColors);

    setEditingAccount(null);
    setAccountDraft({
      name: "",
      currency: "KZT",
      type: "card",
      color,
    });
    setAccountColor(color);
    setSheetType("account");
  }, [accountsStore, getFreeColor]);

  const openEditAccount = useCallback((account) => {
    if (!account) return;

    setEditingAccount(account);
    setAccountDraft(account);
    setAccountColor(account.color || "blue");
    setSheetType("account");
  }, []);

  const handleSaveAccount = useCallback(
    (data) => {
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === data.id
            ? {
                ...account,
                name: String(data.name || account.name).trim(),
                currency: data.currency || account.currency,
                type: data.type || account.type,
                color: data.color || account.color,
              }
            : account
        )
      );

      closeSheet();
    },
    [setAccounts, closeSheet]
  );

  const handleCreateAccount = useCallback(
    (data) => {
      const name = String(data?.name || "").trim();
      if (!name) return;

      setAccounts((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name,
          currency: data.currency || "KZT",
          color: data.color || accountColor,
          type: data.type || "card",
          balance: 0,
        },
      ]);

      closeSheet();
    },
    [setAccounts, accountColor, closeSheet]
  );

  const handleTransactionPress = useCallback((tx) => {
    if (!tx) return;

    setEditingTransaction({
      ...tx,
      categoryId:
        tx.categoryId || tx.category || (tx.type === "transfer" ? "transfer" : "uncategorized"),
      from: tx.from || tx.fromAccountId || "",
      to: tx.to || tx.toAccountId || "",
      note: String(tx.note || ""),
      date: getDateValue(tx.date),
      currency: tx.currency || "KZT",
    });
    setSheetType("transaction");
  }, []);

  const renderFooter = useCallback(() => {
    if (sheetType === "add") {
      return (
        <button
          style={btnStyle}
          onClick={() => document.dispatchEvent(new Event("submitTransaction"))}
        >
          Сохранить
        </button>
      );
    }

    if (sheetType === "account") {
      return (
        <button
          style={btnStyle}
          onClick={() => document.dispatchEvent(new Event("submitAccount"))}
        >
          {editingAccount ? "Сохранить" : "Создать"}
        </button>
      );
    }

    return null;
  }, [sheetType, editingAccount]);

  const usedAccountColors = useMemo(() => {
    const editingId = editingAccount?.id;
    return accountsStore
      .filter((account) => account.id !== editingId)
      .map((account) => account.color)
      .filter(Boolean);
  }, [accountsStore, editingAccount]);

  const sheetTitle = {
    settings: "Настройки",
    notifications: "Уведомления",
    add: "Новая операция",
    account: editingAccount ? "Редактировать счет" : "Новый счет",
    transaction: "Изменить операцию",
    currency: "Валюты",
    themeColor: "Цвет приложения",
    accountColor: "Цвет счета",
  }[sheetType] || "";

  return (
    <CurrencyProvider>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Header
          onOpenSettings={() => setSheetType("settings")}
          onOpenNotifications={() => setSheetType("notifications")}
          disabled={!!sheetType}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            paddingTop: 0,
          }}
        >
          <TotalBalance accounts={accounts} />

          <MainContent
            accounts={accounts}
            activeIndex={safeActiveIndex}
            setActiveIndex={setActiveIndex}
            transactions={transactions}
            onAdd={openCreateAccount}
            onEdit={openEditAccount}
            onOpenCurrency={() => setSheetType("currency")}
            onTransactionPress={handleTransactionPress}
          />

          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSheet={(type) => setSheetType(type)}
          />
        </div>

        <BottomSheet
          open={!!sheetType}
          onClose={closeSheet}
          title={sheetTitle}
          footer={renderFooter()}
        >
          {sheetType === "settings" && (
            <SettingsContent
              onOpenColorPicker={() => openNestedSheet("themeColor", "settings")}
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
              usedColors={usedAccountColors}
              onOpenColorPicker={() => openNestedSheet("accountColor", "account")}
              onChange={setAccountDraft}
              onSave={(data) =>
                editingAccount
                  ? handleSaveAccount(data)
                  : handleCreateAccount(data)
              }
            />
          )}

          {sheetType === "transaction" && editingTransaction && (
            <TransactionEditContent
              transaction={editingTransaction}
              accounts={accounts}
              onSave={(updated) => {
                updateTransaction(updated);
                closeSheet();
              }}
              onDelete={(id) => {
                deleteTransaction(id);
                closeSheet();
              }}
            />
          )}

          {sheetType === "currency" && <CurrencyPickerContent />}

          {sheetType === "themeColor" && (
            <ColorPickerContent
              title="Цвет приложения"
              value={primaryKey}
              onChange={(nextColor) => {
                setPrimaryKey(nextColor);
                goBackToParentSheet();
              }}
            />
          )}

          {sheetType === "accountColor" && (
            <AccountColorPickerContent
              value={accountColor}
              usedColors={usedAccountColors}
              onChange={(nextColor) => {
                setAccountColor(nextColor);
                setAccountDraft((prev) =>
                  prev ? { ...prev, color: nextColor } : prev
                );
                goBackToParentSheet();
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
