import { categories } from "../data/categories";

export const getCategory = (id) => {
  return categories.find((c) => c.id === id);
};