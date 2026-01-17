import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

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

interface UseProductsOptions {
  category?: string;
  search?: string;
  enabled?: boolean;
}

const useProducts = (options: UseProductsOptions = {}) => {
  const { category = "all", search = "", enabled = true } = options;
  const api = useApi();

  const result = useInfiniteQuery({
    queryKey: ["products", category, search],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const params = new URLSearchParams({
          page: pageParam.toString(),
          limit: "20", // 20 products per page
        });
        
        if (category && category !== "all") {
          params.append("category", category);
        }
        if (search) {
          params.append("search", search);
        }
        
        const { data } = await api.get<ProductsResponse>(`/product/list?${params.toString()}`);
        
        if (data.success && data.products) {
          return {
            products: data.products,
            pagination: data.pagination,
          };
        }
        throw new Error(data.message || "Failed to fetch products");
      } catch (error: any) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
    retry: 2,
    retryDelay: 1000,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Flatten all pages into a single array
  const products = result.data?.pages.flatMap((page) => page.products) ?? [];
  const totalProducts = result.data?.pages[0]?.pagination.total ?? 0;
  const hasMore = result.data?.pages[result.data.pages.length - 1]?.pagination.hasMore ?? false;

  return {
    ...result,
    products,
    totalProducts,
    hasMore,
    loadMore: result.fetchNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};

export default useProducts;
