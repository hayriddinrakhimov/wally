// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

export const BottomSheet = ({
  open,
  onClose,
  title,
  children,
  footer, // рџ”Ґ РЅРѕРІС‹Р№ РїСЂРѕРї
}) => {
  const y = useMotionValue(0);

  const SHEET_HEIGHT = window.innerHeight * 0.85;
  const CLOSE_THRESHOLD = SHEET_HEIGHT * 0.25;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "black",
              zIndex: 50,
            }}
          />

          {/* SHEET */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            style={{
              y,
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,

              height: "85vh",
              display: "flex",
              flexDirection: "column",

              background: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              zIndex: 100,
              overflow: "hidden",
              touchAction: "none",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onDragEnd={(_, info) => {
              const offset = info.offset.y;
              const velocity = info.velocity.y;

              if (offset > CLOSE_THRESHOLD || velocity > 800) {
                onClose();
              } else {
                y.set(0);
              }
            }}
          >
            {/* HANDLE */}
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                background: "#ddd",
                margin: "8px auto",
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
                padding: "0 16px 16px", // С‡СѓС‚СЊ РјРµРЅСЊС€Рµ, С‡С‚РѕР±С‹ РЅРµ Р»РёРїР»Рѕ Рє С„СѓС‚РµСЂСѓ
              }}
            >
              {children}
            </div>

            {/* рџ”Ґ FOOTER (РєРЅРѕРїРєР° РІСЃРµРіРґР° СЃРЅРёР·Сѓ) */}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};