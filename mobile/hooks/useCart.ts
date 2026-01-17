import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Cart, CartItem } from "@/types";

interface UseCartOptions {
  enabled?: boolean;
}

const useCart = (options: UseCartOptions = {}) => {
  const { enabled = false } = options; // Default to lazy loading
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: cartData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; cartItems: CartItem[] }>("/cart/get");
      if (data.success && data.cartItems) {
        // Transform cartItems to Cart format
        return {
          items: data.cartItems,
        } as Cart;
      }
      return { items: [] } as Cart;
    },
    enabled, // Only fetch when enabled is true
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const cart = cartData || { items: [] };

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      const { data } = await api.post<{ cart: Cart }>("/cart", { productId, quantity });
      return data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Auto-enable cart query after first mutation
      if (!enabled) {
        refetch();
      }
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const { data } = await api.put<{ cart: Cart }>(`/cart/${productId}`, { quantity });
      return data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Auto-enable cart query after first mutation
      if (!enabled) {
        refetch();
      }
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ cart: Cart }>(`/cart/${productId}`);
      return data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Auto-enable cart query after first mutation
      if (!enabled) {
        refetch();
      }
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ cart: Cart }>("/cart");
      return data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Auto-enable cart query after first mutation
      if (!enabled) {
        refetch();
      }
    },
  });

  const cartTotal =
    cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};
export default useCart;
