import { motion } from "framer-motion";
import { AccountCard } from "./AccountCard";
import { AddAccountCard } from "./AddAccountCard";
import { useRef } from "react";

export const AccountsStack = ({
  accounts,
  index = 0,
  setIndex,
  onAdd,
}) => {
  const isDragging = useRef(false);

  const items = [...accounts, { id: "__add__" }];
  const count = items.length;

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let newIndex = index;

    if (offset < -60 || velocity < -500) {
      newIndex = index + 1;
    }

    if (offset > 60 || velocity > 500) {
      newIndex = index - 1;
    }

    newIndex = Math.max(0, Math.min(newIndex, count - 1));

    setIndex(newIndex);
    isDragging.current = false;
  };

  return (
    <div
      style={{
        position: "relative",
        height: 220, // 🔥 было 200 → добавили место под индикатор
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", // 👈 НЕ ТРОГАЕМ (важно для drag)
      }}
    >
      {items.map((acc, i) => {
        const offset = i - index;
        const isActive = offset === 0;

        return (
          <motion.div
            key={acc.id}
            animate={{
              x: offset * 260,
              scale: isActive ? 1 : 0.92,
              opacity: isActive ? 1 : 0.4,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22,
              mass: 0.8,
            }}
            drag="x"
            dragElastic={0.25}
            dragMomentum={true}
            dragSnapToOrigin
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              position: "absolute",
              width: 260,
              cursor: "grab",
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            {acc.id === "__add__" ? (
              <AddAccountCard
                onClick={() => {
                  if (!isDragging.current) onAdd();
                }}
              />
            ) : (
              <AccountCard
                account={acc}
                isActive={isActive}
              />
            )}
          </motion.div>
        );
      })}

      {/* индикатор */}
      <div
        style={{
          position: "absolute",
          bottom: 10, // 🔥 было 0 → из-за этого резался
          display: "flex",
          gap: 6,
        }}
      >
        {items.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: index === i ? 1.2 : 1,
              opacity: index === i ? 1 : 0.3,
            }}
            transition={{ duration: 0.2 }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#111",
            }}
          />
        ))}
      </div>
    </div>
  );
};