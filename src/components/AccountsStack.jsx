import { motion, AnimatePresence } from "framer-motion";
import { AccountCard } from "./AccountCard";

export const AccountsStack = ({
  accounts = [],
  index,
  setIndex,
}) => {
  const paginate = (direction) => {
    let next = index + direction;

    if (next < 0) next = accounts.length - 1;
    if (next >= accounts.length) next = 0;

    setIndex(next);
  };

  return (
    <div
      style={{
        width: "100%",
        height: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* КАРТА */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={accounts[index]?.id}
            drag="x"
            dragElastic={0.2}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -100) paginate(1);
              if (info.offset.x > 100) paginate(-1);
            }}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              width: "90%",
              maxWidth: 400,
            }}
          >
            <AccountCard account={accounts[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ИНДИКАТОР */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 16,
        }}
      >
        {accounts.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            style={{
              height: 6,
              width: i === index ? 32 : 16,
              borderRadius: 10,
              background: i === index ? "#16a34a" : "#e5e7eb",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};