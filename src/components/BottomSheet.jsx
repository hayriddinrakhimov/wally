import { X } from "lucide-react";

export const BottomSheet = ({ open, onClose, title, children }) => {
  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        />
      )}

      {/* SHEET */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1001,
          background: "var(--bg)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 16,
          transform: open ? "translateY(0%)" : "translateY(100%)",
          transition: "transform 0.25s ease",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h3>{title}</h3>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        {children}
      </div>
    </>
  );
};