import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";

import { Header } from "./components/Header";
import { MainContent } from "./components/MainContent";
import { Navbar } from "./components/Navbar";
import { BottomSheet } from "./components/BottomSheet";
import TotalBalance from "./components/TotalBalance.jsx";
import { AnalyticsContent } from "./components/AnalyticsContent";
import { SubscriptionsContent } from "./components/SubscriptionsContent";
import { DepositGoalsContent } from "./components/DepositGoalsContent";

import { SettingsContent } from "./components/SettingsContent";
import { NotificationsContent } from "./components/NotificationsContent";
import { TransactionContent } from "./components/TransactionContent";
import { TransactionEditContent } from "./components/TransactionEditContent";
import { AccountFormContent } from "./components/AccountFormContent";
import { AccountColorPickerContent } from "./components/AccountColorPickerContent";
import { ColorPickerContent } from "./components/ColorPickerContent";
import { CurrencyPickerContent } from "./components/CurrencyPickerContent";
import { SubscriptionFormContent } from "./components/SubscriptionFormContent";
import { DepositGoalFormContent } from "./components/DepositGoalFormContent";

import { CurrencyProvider } from "./context/CurrencyProvider";
import { useSetPrimary } from "./theme/useTheme";
import { advanceSubscriptionDueDate } from "./utils/financeSelectors";
import {
  getDateValue,
  normalizeGoal,
  normalizeSubscription,
  normalizeTransaction,
} from "./utils/normalizers";

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
  const [subscriptionsRaw, setSubscriptions] = useLocalStorage("subscriptions_v1", []);
  const [depositGoalsRaw, setDepositGoals] = useLocalStorage("depositGoals_v1", []);
  const [activeIndex, setActiveIndex] = useLocalStorage("activeIndex", 0);

  const [editingAccount, setEditingAccount] = useState(null);
  const [accountColor, setAccountColor] = useState("blue");
  const [accountDraft, setAccountDraft] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionPreset, setTransactionPreset] = useState(null);

  const [editingSubscription, setEditingSubscription] = useState(null);
  const [subscriptionDraft, setSubscriptionDraft] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalDraft, setGoalDraft] = useState(null);

  const accountsStore = useMemo(
    () => (Array.isArray(accountsRaw) ? accountsRaw : []),
    [accountsRaw]
  );
  const transactionsStore = useMemo(
    () => (Array.isArray(transactionsRaw) ? transactionsRaw : []),
    [transactionsRaw]
  );
  const subscriptionsStore = useMemo(
    () => (Array.isArray(subscriptionsRaw) ? subscriptionsRaw : []),
    [subscriptionsRaw]
  );
  const depositGoalsStore = useMemo(
    () => (Array.isArray(depositGoalsRaw) ? depositGoalsRaw : []),
    [depositGoalsRaw]
  );

  const activeIndexValue = useMemo(
    () => (Number.isFinite(Number(activeIndex)) ? Number(activeIndex) : 0),
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

  const subscriptions = useMemo(
    () =>
      subscriptionsStore
        .map((item, index) => normalizeSubscription(item, `sub-${index}`))
        .filter(Boolean),
    [subscriptionsStore]
  );

  const depositGoals = useMemo(
    () =>
      depositGoalsStore
        .map((item, index) => normalizeGoal(item, `goal-${index}`))
        .filter(Boolean),
    [depositGoalsStore]
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

    const orderedTransactions = [...transactions].sort((a, b) => a.date - b.date);

    orderedTransactions.forEach((tx) => {
      const amount = Number(tx.amount);
      if (!Number.isFinite(amount) || amount <= 0) return;

      if (tx.type === "expense") {
        if (byId.has(tx.from)) byId.get(tx.from).balance -= amount;
        return;
      }

      if (tx.type === "income") {
        if (byId.has(tx.to)) byId.get(tx.to).balance += amount;
        return;
      }

      if (tx.type === "transfer") {
        if (!tx.from || !tx.to || tx.from === tx.to) return;
        if (byId.has(tx.from)) byId.get(tx.from).balance -= amount;
        if (byId.has(tx.to)) byId.get(tx.to).balance += amount;
      }
    });

    return Array.from(byId.values());
  }, [accountsStore, transactions]);

  const safeActiveIndex = useMemo(() => {
    if (!accounts.length) return 0;

    const normalized = activeIndexValue % accounts.length;
    return normalized >= 0 ? normalized : normalized + accounts.length;
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

  const syncSubscriptionByTransaction = useCallback(
    (transaction) => {
      if (!transaction?.subscriptionId) return;

      setSubscriptions((prev) =>
        prev.map((item) => {
          if (String(item.id) !== String(transaction.subscriptionId)) return item;
          return {
            ...item,
            nextDueDate: advanceSubscriptionDueDate(item, transaction.date),
          };
        })
      );
    },
    [setSubscriptions]
  );

  const addTransaction = useCallback(
    (transactionDraft) => {
      const transaction = normalizeTransaction(transactionDraft);
      if (!transaction) return;

      setTransactions((prev) => [transaction, ...prev]);
      syncSubscriptionByTransaction(transaction);

      setSheetType(null);
      setEditingTransaction(null);
      setTransactionPreset(null);
    },
    [setTransactions, syncSubscriptionByTransaction]
  );

  const updateTransaction = useCallback(
    (updatedDraft) => {
      const normalized = normalizeTransaction(updatedDraft, updatedDraft?.id);
      if (!normalized) return;

      setTransactions((prev) =>
        prev.map((tx) => (String(tx.id) === normalized.id ? normalized : tx))
      );
      syncSubscriptionByTransaction(normalized);
    },
    [setTransactions, syncSubscriptionByTransaction]
  );

  const deleteTransaction = useCallback(
    (id) => {
      const normalizedId = String(id);
      setTransactions((prev) => prev.filter((tx) => String(tx.id) !== normalizedId));
    },
    [setTransactions]
  );

  const closeSheet = useCallback(() => {
    setSheetType(null);
    setSheetReturnType(null);
    setEditingAccount(null);
    setAccountDraft(null);
    setEditingTransaction(null);
    setEditingSubscription(null);
    setSubscriptionDraft(null);
    setEditingGoal(null);
    setGoalDraft(null);
    setTransactionPreset(null);
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
    const usedColors = accountsStore.map((account) => account.color).filter(Boolean);
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

  const openCreateSubscription = useCallback(() => {
    setEditingSubscription(null);
    setSubscriptionDraft({
      name: "",
      amount: "",
      currency: "KZT",
      cycle: "month",
      startDate: Date.now(),
      nextDueDate: Date.now(),
      accountId: accounts[0]?.id || "",
      categoryId: "uncategorized",
      isActive: true,
      remindBeforeDays: 7,
      note: "",
    });
    setSheetType("subscription");
  }, [accounts]);

  const openEditSubscription = useCallback((subscription) => {
    if (!subscription) return;
    setEditingSubscription(subscription);
    setSubscriptionDraft(subscription);
    setSheetType("subscription");
  }, []);

  const saveSubscription = useCallback(
    (draft) => {
      const normalized = normalizeSubscription(draft, draft?.id);
      if (!normalized) return;

      if (editingSubscription) {
        setSubscriptions((prev) =>
          prev.map((item) =>
            String(item.id) === String(normalized.id) ? normalized : item
          )
        );
      } else {
        setSubscriptions((prev) => [normalized, ...prev]);
      }

      closeSheet();
    },
    [editingSubscription, setSubscriptions, closeSheet]
  );

  const archiveSubscription = useCallback(
    (subscription) => {
      if (!subscription) return;

      setSubscriptions((prev) =>
        prev.map((item) =>
          String(item.id) === String(subscription.id)
            ? { ...item, isActive: false }
            : item
        )
      );

      if (sheetType === "subscription") {
        closeSheet();
      }
    },
    [setSubscriptions, closeSheet, sheetType]
  );

  const openCreateGoal = useCallback(() => {
    setEditingGoal(null);
    setGoalDraft({
      title: "",
      targetAmount: "",
      currency: "KZT",
      startDate: Date.now(),
      targetDate: Date.now() + 1000 * 60 * 60 * 24 * 90,
      plannedContribution: "",
      frequency: "month",
      linkedAccountId:
        accounts.find((account) => account.type === "deposit")?.id ||
        accounts[0]?.id ||
        "",
      isActive: true,
      note: "",
    });
    setSheetType("goal");
  }, [accounts]);

  const openEditGoal = useCallback((goal) => {
    if (!goal) return;
    setEditingGoal(goal);
    setGoalDraft(goal);
    setSheetType("goal");
  }, []);

  const saveGoal = useCallback(
    (draft) => {
      const normalized = normalizeGoal(draft, draft?.id);
      if (!normalized) return;

      if (editingGoal) {
        setDepositGoals((prev) =>
          prev.map((item) =>
            String(item.id) === String(normalized.id) ? normalized : item
          )
        );
      } else {
        setDepositGoals((prev) => [normalized, ...prev]);
      }

      closeSheet();
    },
    [editingGoal, setDepositGoals, closeSheet]
  );

  const archiveGoal = useCallback(
    (goal) => {
      if (!goal) return;

      setDepositGoals((prev) =>
        prev.map((item) =>
          String(item.id) === String(goal.id) ? { ...item, isActive: false } : item
        )
      );

      if (sheetType === "goal") {
        closeSheet();
      }
    },
    [setDepositGoals, closeSheet, sheetType]
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
      subscriptionId: tx.subscriptionId || null,
      goalId: tx.goalId || null,
    });
    setSheetType("transaction");
  }, []);

  const openAddTransaction = useCallback((preset = null) => {
    setTransactionPreset(preset);
    setSheetType("add");
  }, []);

  const markSubscriptionAsPaid = useCallback(
    (subscription) => {
      if (!subscription) return;

      openAddTransaction({
        type: "expense",
        amount: Number(subscription.amount) || "",
        currency: subscription.currency || "KZT",
        from: subscription.accountId || accounts[0]?.id || "",
        categoryId: subscription.categoryId || "uncategorized",
        note: subscription.name || "",
        subscriptionId: subscription.id,
      });
    },
    [openAddTransaction, accounts]
  );

  const topUpGoal = useCallback(
    (goal) => {
      if (!goal) return;

      const fromAccount =
        accounts.find((account) => account.id !== goal.linkedAccountId)?.id ||
        goal.linkedAccountId ||
        "";

      openAddTransaction({
        type: "transfer",
        amount: Number(goal.plannedContribution) || "",
        currency: goal.currency || "KZT",
        from: fromAccount,
        to: goal.linkedAccountId || "",
        note: `Пополнение: ${goal.title || ""}`.trim(),
        goalId: goal.id,
      });
    },
    [openAddTransaction, accounts]
  );

  const withdrawFromGoal = useCallback(
    (goal) => {
      if (!goal) return;

      const toAccount =
        accounts.find((account) => account.id !== goal.linkedAccountId)?.id ||
        goal.linkedAccountId ||
        "";

      openAddTransaction({
        type: "transfer",
        amount: Number(goal.plannedContribution) || "",
        currency: goal.currency || "KZT",
        from: goal.linkedAccountId || "",
        to: toAccount,
        note: `Снятие: ${goal.title || ""}`.trim(),
        goalId: goal.id,
      });
    },
    [openAddTransaction, accounts]
  );

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

    if (sheetType === "subscription") {
      return (
        <button
          style={btnStyle}
          onClick={() => document.dispatchEvent(new Event("submitSubscription"))}
        >
          {editingSubscription ? "Сохранить" : "Создать"}
        </button>
      );
    }

    if (sheetType === "goal") {
      return (
        <button
          style={btnStyle}
          onClick={() => document.dispatchEvent(new Event("submitGoal"))}
        >
          {editingGoal ? "Сохранить" : "Создать"}
        </button>
      );
    }

    return null;
  }, [sheetType, editingAccount, editingSubscription, editingGoal]);

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
    subscription: editingSubscription ? "Редактировать подписку" : "Новая подписка",
    goal: editingGoal ? "Редактировать цель" : "Новая цель",
  }[sheetType] || "";

  const headerMeta = {
    wallet: { title: "Кошелек", subtitle: "Счета и операции" },
    analytics: { title: "Аналитика", subtitle: "Динамика доходов и расходов" },
    subscriptions: { title: "Подписки", subtitle: "Регулярные платежи" },
    deposit: { title: "Цели", subtitle: "Накопления и прогресс" },
  }[activeTab] || { title: "Wally", subtitle: "Ваш личный кошелек" };

  return (
    <CurrencyProvider>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        <Header
          onOpenSettings={() => setSheetType("settings")}
          onOpenNotifications={() => setSheetType("notifications")}
          title={headerMeta.title}
          subtitle={headerMeta.subtitle}
          disabled={!!sheetType}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
            paddingTop: 12,
            paddingBottom: 12,
            gap: 12,
          }}
        >
          {activeTab === "wallet" && (
            <>
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
            </>
          )}

          {activeTab === "analytics" && <AnalyticsContent transactions={transactions} />}

          {activeTab === "subscriptions" && (
            <SubscriptionsContent
              subscriptions={subscriptions}
              transactions={transactions}
              accounts={accounts}
              onCreate={openCreateSubscription}
              onEdit={openEditSubscription}
              onArchive={archiveSubscription}
              onMarkPaid={markSubscriptionAsPaid}
            />
          )}

          {activeTab === "deposit" && (
            <DepositGoalsContent
              goals={depositGoals}
              transactions={transactions}
              accounts={accounts}
              onCreate={openCreateGoal}
              onEdit={openEditGoal}
              onArchive={archiveGoal}
              onTopUp={topUpGoal}
              onWithdraw={withdrawFromGoal}
            />
          )}
        </div>

        <div style={{ flexShrink: 0 }}>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSheet={(type) => {
              if (type === "add") {
                openAddTransaction(null);
                return;
              }
              setSheetType(type);
            }}
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
              subscriptions={subscriptions}
              goals={depositGoals}
              initialDraft={transactionPreset}
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
                editingAccount ? handleSaveAccount(data) : handleCreateAccount(data)
              }
            />
          )}

          {sheetType === "transaction" && editingTransaction && (
            <TransactionEditContent
              transaction={editingTransaction}
              accounts={accounts}
              subscriptions={subscriptions}
              goals={depositGoals}
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

          {sheetType === "subscription" && (
            <SubscriptionFormContent
              subscription={subscriptionDraft}
              accounts={accounts}
              onSave={saveSubscription}
              onDelete={() => archiveSubscription(subscriptionDraft)}
            />
          )}

          {sheetType === "goal" && (
            <DepositGoalFormContent
              goal={goalDraft}
              accounts={accounts}
              onSave={saveGoal}
              onDelete={() => archiveGoal(goalDraft)}
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
                setAccountDraft((prev) => (prev ? { ...prev, color: nextColor } : prev));
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
