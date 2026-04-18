import { motion } from "framer-motion";
import { AccountCard } from "./AccountCard";

export const AccountsStack = ({ accounts, index = 0, setIndex }) => {
  const count = accounts.length;

  const handleDragEnd = (e, info) => {
    if (!setIndex || count <= 1) return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -80 || velocity < -500) {
      setIndex((prev) => (prev + 1) % count);
    } else if (offset > 80 || velocity > 500) {
      setIndex((prev) => (prev - 1 + count) % count);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: 200,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

      }}
    >
      {accounts.map((acc, i) => {
        let offset = i - index;

        if (offset > count / 2) offset -= count;
        if (offset < -count / 2) offset += count;

        return (
          <motion.div
            key={acc.id}
            animate={{
              x: offset * 270, 
              scale: offset === 0 ? 1 : 0.88,
              opacity: offset === 0 ? 1 : 0.6,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            style={{
              position: "absolute",
              width: 260,
              cursor: "grab",
            }}
          >
            <AccountCard account={acc} isActive={offset === 0} />
          </motion.div>
        );
      })}
    </div>
  );
};