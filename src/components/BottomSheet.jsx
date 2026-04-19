import { motion, AnimatePresence } from "framer-motion";

export const BottomSheet = ({
  open,
  onClose,
  title,
  children,
}) => {
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              zIndex: 100,
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                padding: 16,
                borderBottom: "1px solid #eee",
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              {title}
            </div>

            {/* CONTENT */}
            <div
            style={{
            padding: "0 16px 24px",
            }}
            >
            {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};