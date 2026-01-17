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
      // Get current cart
      const { data: cartData } = await api.get<{ success: boolean; cartItems: CartItem[] }>("/cart/get");
      const currentCart = cartData.cartItems || [];
      
      // Find existing item
      const existingItem = currentCart.find(item => item.product._id === productId);
      const cartKey = productId;
      
      // Update cart object
      const cartItemsObj: any = {};
      currentCart.forEach(item => {
        const key = item._id.includes('_') ? item._id : item.product._id;
        cartItemsObj[key] = { quantity: item.quantity };
      });
      
      if (existingItem) {
        cartItemsObj[cartKey] = { quantity: (existingItem.quantity || 0) + quantity };
      } else {
        cartItemsObj[cartKey] = { quantity };
      }
      
      // Update cart
      await api.post("/cart/update", { cartData: cartItemsObj });
      return { items: [] } as Cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (!enabled) {
        refetch();
      }
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      // Get current cart
      const { data: cartData } = await api.get<{ success: boolean; cartItems: CartItem[] }>("/cart/get");
      const currentCart = cartData.cartItems || [];
      
      // Update cart object
      const cartItemsObj: any = {};
      currentCart.forEach(item => {
        const key = item._id.includes('_') ? item._id : item.product._id;
        if (item.product._id === productId) {
          cartItemsObj[key] = { quantity };
        } else {
          cartItemsObj[key] = { quantity: item.quantity };
        }
      });
      
      // Update cart
      await api.post("/cart/update", { cartData: cartItemsObj });
      return { items: [] } as Cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (!enabled) {
        refetch();
      }
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      // Get current cart
      const { data: cartData } = await api.get<{ success: boolean; cartItems: CartItem[] }>("/cart/get");
      const currentCart = cartData.cartItems || [];
      
      // Remove item from cart object
      const cartItemsObj: any = {};
      currentCart.forEach(item => {
        const key = item._id.includes('_') ? item._id : item.product._id;
        if (item.product._id !== productId) {
          cartItemsObj[key] = { quantity: item.quantity };
        }
      });
      
      // Update cart
      await api.post("/cart/update", { cartData: cartItemsObj });
      return { items: [] } as Cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (!enabled) {
        refetch();
      }
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      // Clear cart
      await api.post("/cart/update", { cartData: {} });
      return { items: [] } as Cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (!enabled) {
        refetch();
      }
    },
  });

  const cartTotal =
    cart?.items.reduce((sum, item) => sum + (item.product.offerPrice || item.product.price) * item.quantity, 0) ?? 0;

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
