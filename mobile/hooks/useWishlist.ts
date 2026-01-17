import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types";

interface UseWishlistOptions {
  enabled?: boolean;
}

const useWishlist = (options: UseWishlistOptions = {}) => {
  const { enabled = false } = options; // Default to lazy loading
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: wishlist,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; wishlist: Product[] }>("/users/wishlist");
      if (data.success && data.wishlist) {
        return data.wishlist;
      }
      return [];
    },
    enabled, // Only fetch when enabled is true
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post<{ success: boolean; wishlist: string[] }>("/users/wishlist", { productId });
      if (data.success) {
        return data.wishlist;
      }
      throw new Error("Failed to add to wishlist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      // Auto-enable wishlist query after first mutation
      if (!enabled) {
        refetch();
      }
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ success: boolean; wishlist: string[] }>(`/users/wishlist/${productId}`);
      if (data.success) {
        return data.wishlist;
      }
      throw new Error("Failed to remove from wishlist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      // Auto-enable wishlist query after first mutation
      if (!enabled) {
        refetch();
      }
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlist?.some((product) => product._id === productId) ?? false;
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  return {
    wishlist: wishlist || [],
    isLoading,
    isError,
    wishlistCount: wishlist?.length || 0,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
  };
};

export default useWishlist;
