import { useTheme } from "../theme/ThemeProvider";

export const NotificationsContent = ({
  notifications,
  onClick,
  markAllAsRead,
}) => {
  const theme = useTheme(); // ✅ правильно

  const sorted = [...(notifications || [])].sort(
    (a, b) => b.time - a.time
  );

  return (
    <div>
      {/* ACTION BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: theme.spacing.md,
        }}
      >
        <button
          onClick={markAllAsRead}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: theme.colors.primary,
            fontSize: theme.font.body,
          }}
        >
          Прочитать все
        </button>
      </div>

      {/* EMPTY */}
      {sorted.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: theme.spacing.xl,
          }}
        >
          <div
            style={{
              color: theme.colors.secondaryText,
            }}
          >
            Нет новых уведомлений
          </div>
        </div>
      )}

      {/* LIST */}
      {sorted.map((n) => (
        <div
          key={n.id}
          onClick={() => onClick(n)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,

            padding: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border}`,

            cursor: "pointer",
            transition: "transform 0.1s ease",
            opacity: n.read ? 0.5 : 1,
          }}
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = "scale(0.98)")
          }
          onMouseUp={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          {/* TEXT */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: theme.colors.text,
                fontWeight: "500",
              }}
            >
              {n.title}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: theme.colors.secondaryText,
                marginTop: "2px",
              }}
            >
              {formatTime(n.time)}
            </div>
          </div>

          {/* DOT */}
          {!n.read && (
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

/* ===== УТИЛКА ===== */

const formatTime = (timestamp) => {
  const date = new Date(timestamp);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};