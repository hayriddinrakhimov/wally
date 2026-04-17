import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, X } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  onBack,
  children,
}) => {
  const theme = useTheme();

  const showHeader = Boolean(title || onBack);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        {/* OVERLAY */}
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        />

        {/* SHEET */}
        <Dialog.Content
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "85vh",

            background: theme.colors.background,

            borderTopLeftRadius: theme.radius.md,
            borderTopRightRadius: theme.radius.md,

            display: "flex",
            flexDirection: "column",
            overflow: "hidden",

            zIndex: 1001,
          }}
        >
          {/* HANDLE */}
          <div
            style={{
              width: "36px",
              height: "4px",
              background: theme.colors.border,
              borderRadius: "2px",
              margin: "8px auto",
            }}
          />

          {/* HEADER */}
          {showHeader && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: `0 ${theme.spacing.lg}`,
                borderBottom: `1px solid ${theme.colors.border}`,
                paddingBottom: theme.spacing.sm,
                marginBottom: theme.spacing.md,
              }}
            >
              {/* LEFT */}
              <div style={{ width: "40px" }}>
                {onBack && (
                  <button style={iconBtn} onClick={onBack}>
                    <ArrowLeft size={20} color={theme.colors.text} />
                  </button>
                )}
              </div>

              {/* TITLE */}
              <div
                style={{
                  flex: 1,
                  fontSize: theme.font.title,
                  fontWeight: "600",
                  color: theme.colors.text,
                }}
              >
                {title}
              </div>

              {/* RIGHT */}
              <div
                style={{
                  width: "40px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button style={iconBtn} onClick={onClose}>
                  <X size={20} color={theme.colors.text} />
                </button>
              </div>
            </div>
          )}

          {/* CONTENT */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: theme.spacing.lg,
              paddingBottom: `calc(${theme.spacing.lg} + env(safe-area-inset-bottom))`,

              // скрытие скролла
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const iconBtn = {
  width: "40px",
  height: "40px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};