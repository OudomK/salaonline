import apiClient from "../client";

export const categoryService = {
  getAllCategories: (params) => apiClient.get("/category", { params }),
};
