import {
  motion as Motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { useEffect } from "react";

const BottomSheet = ({
  open,
  onClose,
  title,
  children,
  footer,
}) => {
  const y = useMotionValue(0);
  const dragControls = useDragControls();

  const sheetHeight =
    typeof window === "undefined"
      ? 640
      : Math.max(420, Math.round(window.innerHeight * 0.85));

  const closeThreshold = Math.round(sheetHeight * 0.25);

  useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <Motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "black",
              zIndex: 120,
            }}
          />

          {/* SHEET */}
          <Motion.div
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            style={{
              y,
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: sheetHeight,
              display: "flex",
              flexDirection: "column",
              background: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              zIndex: 130,
              overflow: "hidden",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onDragEnd={(_, info) => {
              const offset = info.offset.y;
              const velocity = info.velocity.y;

              if (offset > closeThreshold || velocity > 800) {
                onClose();
              } else {
                y.set(0);
              }
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* HANDLE */}
            <div
              onPointerDown={(event) => dragControls.start(event)}
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                background: "#ddd",
                margin: "8px auto",
                cursor: "grab",
                touchAction: "none",
              }}
            />

            {/* HEADER */}
            <div
              style={{
                padding: 16,
                borderBottom: "1px solid #eee",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {title}
            </div>

            {/* CONTENT */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                padding: "0 16px 16px",
              }}
            >
              {children}
            </div>

            {/* FOOTER */}
            {footer && (
              <div
                style={{
                  borderTop: "1px solid #eee",
                  padding: 16,
                  background: "white",
                  flexShrink: 0,
                }}
              >
                {footer}
              </div>
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { BottomSheet };
export default BottomSheet;
