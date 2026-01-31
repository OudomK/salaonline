import { categoryService } from "@/lib/api/services/category.service";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (params = {}, enable = true) => {
  return useQuery({
    queryKey: ["category", params],
    queryFn: async () => {
      const res = await categoryService.getAllCategories(params)
      return res.data
    },
    enabled: enable,
  });
};
