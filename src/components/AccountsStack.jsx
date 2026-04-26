import { motion } from "framer-motion";
import { AccountCard } from "./AccountCard";
import { useRef } from "react";

export const AccountsStack = ({
  accounts,
  index = 0,
  setIndex,
  onEdit,
}) => {
  const isDragging = useRef(false);

  const count = accounts?.length || 0;

  const safeIndex =
    count > 0 ? ((index % count) + count) % count : 0;

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let newIndex = safeIndex;

    if (offset < -60 || velocity < -500) {
      newIndex = safeIndex + 1;
    } else if (offset > 60 || velocity > 500) {
      newIndex = safeIndex - 1;
    }

    if (count > 0) {
      newIndex = (newIndex + count) % count;
    }

    setIndex?.(newIndex);
    isDragging.current = false;
  };

  const getOffset = (i) => {
    let diff = i - safeIndex;

    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;

    return diff;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 360,
        height: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
      }}
    >
      {accounts.map((acc, i) => {
        const offset = getOffset(i);
        const isActive = offset === 0;

        return (
          <motion.div
            key={acc.id}
            animate={{
              x: offset * 260,
              scale: isActive ? 1 : 0.92,
              opacity: isActive ? 1 : 0.5,
              zIndex: isActive ? 10 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
            drag="x"
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              position: "absolute",
              width: 260,
              cursor: "grab",
            }}
          >
            <AccountCard
              account={acc}
              isActive={isActive}
              onEdit={(account) => {
                if (!isDragging.current) {
                  onEdit?.(account);
                }
              }}
            />
          </motion.div>
        );
      })}

      {/* INDICATOR */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          display: "flex",
          gap: 6,
        }}
      >
        {accounts.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: safeIndex === i ? 1.2 : 1,
              opacity: safeIndex === i ? 1 : 0.3,
            }}
            transition={{ duration: 0.2 }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--text, #111)",
            }}
          />
        ))}
      </div>
    </div>
  );
};