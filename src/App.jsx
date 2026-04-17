import { useState } from "react";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { BottomSheet } from "./components/BottomSheet";
import { NotificationsContent } from "./components/NotificationsContent";
import { SettingsContent } from "./components/SettingsContent";
import { ColorPickerContent } from "./components/ColorPickerContent";
import { useTheme } from "./theme/ThemeProvider";

function App({ setPrimary }) {
  const theme = useTheme();

  console.log(theme);

  const [activeTab, setActiveTab] = useState("wallet");
  const [sheetType, setSheetType] = useState(null);

  // ===== УВЕДОМЛЕНИЯ =====
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "stats",
      title: "Обновлена статистика",
      time: Date.now(),
      read: false,
    },
  ]);

  const hasUnread = notifications.some((n) => !n.read);

  const openSheet = (type) => setSheetType(type);
  const closeSheet = () => setSheetType(null);

  const handleNotificationClick = (notif) => {
    setActiveTab(notif.type);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notif.id ? { ...n, read: true } : n
      )
    );

    closeSheet();
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const isSheetOpen = sheetType !== null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        paddingBottom: theme.sizes.navbarHeight,
      }}
    >
      {/* HEADER */}
      <Header
        activeTab={activeTab}
        onOpenSheet={openSheet}
        hasUnread={hasUnread}
      />

      {/* CONTENT */}
      <main style={{ padding: theme.spacing.lg }} />

      {/* NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSheet={openSheet}
      />

      {/* BOTTOM SHEET */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        title={
          sheetType === "settings"
            ? "Настройки"
            : sheetType === "colorPicker"
            ? "Выбор цвета"
            : sheetType === "notifications"
            ? "Уведомления"
            : null
        }
        onBack={
          sheetType === "colorPicker"
            ? () => setSheetType("settings")
            : null
        }
      >
        {sheetType === "notifications" && (
          <NotificationsContent
            notifications={notifications}
            onClick={handleNotificationClick}
            markAllAsRead={markAllAsRead}
          />
        )}

        {sheetType === "settings" && (
          <SettingsContent
            onOpenColorPicker={() =>
              setSheetType("colorPicker")
            }
          />
        )}

        {sheetType === "colorPicker" && (
          <ColorPickerContent
            primary={theme.colors.primary}
            setPrimary={setPrimary}
          />
        )}
      </BottomSheet>
    </div>
  );
}

export default App;