import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  message?: string;
}

// Fetch ALL products without pagination for category extraction
const useAllProducts = () => {
  const api = useApi();

  const result = useQuery({
    queryKey: ["all-products-for-categories"],
    queryFn: async () => {
      try {
        // Fetch with a very high limit to get all products
        const { data } = await api.get<ProductsResponse>(`/product/list?page=1&limit=10000`);
        
        if (data.success && data.products) {
          return data.products;
        }
        throw new Error(data.message || "Failed to fetch products");
      } catch (error: any) {
        console.error("Error fetching all products:", error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    ...result,
    allProducts: result.data ?? [],
  };
};

export default useAllProducts;
