export const AccountColorPickerContent = ({
  value,
  onChange,
  usedColors = [],
}) => {
  const gradients = [
    { id: "blue", bg: "linear-gradient(135deg, #3b82f6, #1e293b)" },
    { id: "green", bg: "linear-gradient(135deg, #22c55e, #1e293b)" },
    { id: "purple", bg: "linear-gradient(135deg, #a855f7, #1e293b)" },
    { id: "orange", bg: "linear-gradient(135deg, #f97316, #1e293b)" },
    { id: "red", bg: "linear-gradient(135deg, #ef4444, #1e293b)" },

    // 🔥 новые
    { id: "pink", bg: "linear-gradient(135deg, #ec4899, #1e293b)" },
    { id: "cyan", bg: "linear-gradient(135deg, #06b6d4, #1e293b)" },
    { id: "yellow", bg: "linear-gradient(135deg, #eab308, #1e293b)" },
    { id: "indigo", bg: "linear-gradient(135deg, #6366f1, #1e293b)" },
    { id: "teal", bg: "linear-gradient(135deg, #14b8a6, #1e293b)" },
  ];

  return (
    <div
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ fontWeight: 600 }}>
        Цвет счета
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {gradients.map((g) => {
          const active = value === g.id;
          const isUsed = usedColors.includes(g.id);

          return (
            <div
              key={g.id}
              onClick={() => {
                if (isUsed) return;
                onChange(g.id);
              }}
              style={{
                height: 60,
                borderRadius: 14,
                background: g.bg,

                cursor: isUsed ? "not-allowed" : "pointer",

                opacity: isUsed && !active ? 0.35 : 1,

                border: active
                  ? "3px solid white"
                  : "2px solid transparent",

                position: "relative",
                transition: "all 0.2s ease",
              }}
            >
              {/* ✅ выбранный */}
              {active && (
                <div
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    color: "white",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  ✓
                </div>
              )}

              {/* 🔒 занятый */}
              {isUsed && !active && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 600,
                    background: "rgba(0,0,0,0.35)",
                    borderRadius: 14,
                  }}
                >
                  занято
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};