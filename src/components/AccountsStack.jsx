// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useRef } from "react";
import { AccountCard } from "./AccountCard";
import AddAccountCard from "./AddAccountCard.jsx";

const CARD_WIDTH = 260;
const CARD_STEP = 258;

export const AccountsStack = ({
  accounts = [],
  index = 0,
  setIndex,
  onEdit,
  onAdd,
}) => {
  const isDragging = useRef(false);

  const count = accounts.length;
  const safeIndex = count > 0 ? ((index % count) + count) % count : 0;

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_, info) => {
    if (count < 2) {
      isDragging.current = false;
      return;
    }

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let newIndex = safeIndex;

    if (offset < -60 || velocity < -500) {
      newIndex = safeIndex + 1;
    } else if (offset > 60 || velocity > 500) {
      newIndex = safeIndex - 1;
    }

    newIndex = (newIndex + count) % count;
    if (newIndex !== safeIndex) {
      setIndex?.(newIndex);
    }

    isDragging.current = false;
  };

  const getOffset = (i) => {
    let diff = i - safeIndex;

    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;

    return diff;
  };

  if (!count) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 320,
          minHeight: 170,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingInline: 12,
        }}
      >
        <AddAccountCard
          onClick={onAdd}
          compact={false}
          title="Добавить счет"
          subtitle="Создайте первый счет"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 360,
        height: 228,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
      }}
    >
      {accounts.map((acc, i) => {
        const offset = getOffset(i);
        const isActive = offset === 0;
        const isNear = Math.abs(offset) <= 1;

        return (
          <motion.div
            key={acc.id}
            animate={{
              x: offset * CARD_STEP,
              y: isActive ? 0 : 8,
              scale: isActive ? 1 : 0.92,
              opacity: isNear ? (isActive ? 1 : 0.56) : 0,
              zIndex: isActive ? 12 : 8 - Math.abs(offset),
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
            drag={isActive && count > 1 ? "x" : false}
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => {
              if (isDragging.current) return;
              if (!isActive) {
                setIndex?.(i);
              }
            }}
            style={{
              position: "absolute",
              width: CARD_WIDTH,
              cursor:
                count > 1 ? (isActive ? "grab" : "pointer") : "default",
              pointerEvents: isNear ? "auto" : "none",
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

      {count > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            display: "flex",
            gap: 6,
          }}
        >
          {accounts.map((account, i) => (
            <motion.button
              key={account.id}
              type="button"
              onClick={() => setIndex?.(i)}
              animate={{
                scale: safeIndex === i ? 1.2 : 1,
                opacity: safeIndex === i ? 1 : 0.3,
              }}
              transition={{ duration: 0.2 }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                border: "none",
                background: "var(--text, #111)",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

