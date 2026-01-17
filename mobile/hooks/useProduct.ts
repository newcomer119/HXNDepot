import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types";

interface ProductResponse {
  success: boolean;
  product: Product;
  message?: string;
}

export const useProduct = (productId: string) => {
  const api = useApi();

  const result = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await api.get<ProductResponse>(`/product/${productId}`);
      if (data.success && data.product) {
        return data.product;
      }
      throw new Error(data.message || "Failed to fetch product");
    },
    enabled: !!productId,
  });

  return result;
};
