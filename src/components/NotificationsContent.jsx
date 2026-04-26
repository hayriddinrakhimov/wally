import { useTheme } from "../theme/useTheme";

export const NotificationsContent = ({
  notifications,
  onClick,
  markAllAsRead,
}) => {
  const theme = useTheme();

  const list = Array.isArray(notifications) ? notifications : [];

  const sorted = [...list].sort((a, b) => b.time - a.time);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: theme.spacing.md,
        }}
      >
        <button
          type="button"
          onClick={() => markAllAsRead?.()}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: theme.colors.primary,
            fontSize: theme.font?.body || 14,
          }}
        >
          Прочитать все
        </button>
      </div>

      {sorted.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: theme.spacing.xl,
          }}
        >
          <div style={{ color: theme.colors.secondaryText }}>
            Нет новых уведомлений
          </div>
        </div>
      )}

      {sorted.map((notification) => (
        <div
          key={notification.id}
          onClick={() => onClick?.(notification)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
            padding: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border}`,
            cursor: "pointer",
            transition: "transform 0.1s ease",
            opacity: notification.read ? 0.5 : 1,
          }}
          onMouseDown={(event) => {
            event.currentTarget.style.transform = "scale(0.98)";
          }}
          onMouseUp={(event) => {
            event.currentTarget.style.transform = "scale(1)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "scale(1)";
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ color: theme.colors.text, fontWeight: "500" }}>
              {notification.title}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: theme.colors.secondaryText,
                marginTop: "2px",
              }}
            >
              {formatTime(notification.time)}
            </div>
          </div>

          {!notification.read && (
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: theme.colors.primary,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
