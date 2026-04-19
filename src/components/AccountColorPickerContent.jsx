export const AccountColorPickerContent = ({
  value,
  onChange,
}) => {
  const gradients = [
    { id: "blue", bg: "linear-gradient(135deg, #3b82f6, #1e293b)" },
    { id: "green", bg: "linear-gradient(135deg, #22c55e, #1e293b)" },
    { id: "purple", bg: "linear-gradient(135deg, #a855f7, #1e293b)" },
    { id: "orange", bg: "linear-gradient(135deg, #f97316, #1e293b)" },
    { id: "red", bg: "linear-gradient(135deg, #ef4444, #1e293b)" },
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

          return (
            <div
              key={g.id}
              onClick={() => onChange(g.id)}
              style={{
                height: 60,
                borderRadius: 14,
                background: g.bg,
                cursor: "pointer",
                position: "relative",
                border: active
                  ? "3px solid black"
                  : "2px solid transparent",
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};