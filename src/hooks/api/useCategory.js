import { categoryService } from "@/lib/api/services/category.service";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: () => categoryService.getAllCategories(),
  });
};
