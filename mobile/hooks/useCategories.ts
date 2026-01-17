import { useApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface CategoriesResponse {
  success: boolean;
  categories: string[];
  message?: string;
}

const useCategories = () => {
  const api = useApi();

  const result = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data } = await api.get<CategoriesResponse>(`/product/categories`);
        
        if (data.success && data.categories) {
          return data.categories;
        }
        throw new Error(data.message || "Failed to fetch categories");
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    ...result,
    categories: result.data ?? [],
  };
};

export default useCategories;
