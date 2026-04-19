export const AccountHistoryContent = ({ account, transactions }) => {
  const list = transactions.filter(
    (t) => t.from === account.id || t.to === account.id
  );

  return (
    <div style={{ padding: 16 }}>
      {list.length === 0 && (
        <div style={{ opacity: 0.6 }}>
          Пока нет операций
        </div>
      )}

      {list.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          {t.type} — {t.amount}
        </div>
      ))}
    </div>
  );
};