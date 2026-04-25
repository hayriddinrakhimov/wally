import { transactionColors } from "../theme/transactionColors";

export const getTransactionColor = (type) => {
  return transactionColors[type] || "#999";
};