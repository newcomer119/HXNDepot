import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useState } from "react";

interface UseWishlistOptions {
  enabled?: boolean;
}

const useWishlist = (options: UseWishlistOptions = {}) => {
  const { enabled = false } = options; // Default to lazy loading
  const api = useApi();
  const queryClient = useQueryClient();
  const [localWishlistIds, setLocalWishlistIds] = useState<Set<string>>(new Set());

  const {
    data: wishlist,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      try {
        const { data } = await api.get<{ success: boolean; wishlist: Product[] }>("/users/wishlist");
        if (data.success && data.wishlist) {
          // Update local state with fetched wishlist IDs
          const ids = new Set(data.wishlist.map(p => p._id));
          setLocalWishlistIds(ids);
          return data.wishlist;
        }
        setLocalWishlistIds(new Set());
        return [];
      } catch (error: any) {
        console.error("Error fetching wishlist:", error);
        // If unauthorized, return empty array instead of throwing
        if (error?.response?.status === 401) {
          setLocalWishlistIds(new Set());
          return [];
        }
        throw error;
      }
    },
    enabled, // Only fetch when enabled is true
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      try {
        const { data } = await api.post<{ success: boolean; wishlist: string[] }>("/users/wishlist", { productId });
        if (data.success) {
          // Update local state immediately for instant UI feedback
          setLocalWishlistIds(prev => new Set([...prev, productId]));
          return data.wishlist;
        }
        throw new Error(data.message || "Failed to add to wishlist");
      } catch (error: any) {
        console.error("Error adding to wishlist:", error);
        throw new Error(error?.response?.data?.message || error?.message || "Failed to add to wishlist");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      // Auto-enable wishlist query after first mutation
      if (!enabled) {
        refetch();
      }
    },
    onError: (error, productId) => {
      console.error("Add to wishlist error:", error);
      // Revert local state on error
      setLocalWishlistIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      try {
        const { data } = await api.delete<{ success: boolean; wishlist: string[] }>(`/users/wishlist/${productId}`);
        if (data.success) {
          // Update local state immediately for instant UI feedback
          setLocalWishlistIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
          return data.wishlist;
        }
        throw new Error(data.message || "Failed to remove from wishlist");
      } catch (error: any) {
        console.error("Error removing from wishlist:", error);
        throw new Error(error?.response?.data?.message || error?.message || "Failed to remove from wishlist");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      // Auto-enable wishlist query after first mutation
      if (!enabled) {
        refetch();
      }
    },
    onError: (error, productId) => {
      console.error("Remove from wishlist error:", error);
      // Revert local state on error
      setLocalWishlistIds(prev => new Set([...prev, productId]));
    },
  });

  const isInWishlist = (productId: string) => {
    // Check local state first for immediate UI updates
    if (localWishlistIds.has(productId)) {
      return true;
    }
    // Fall back to fetched wishlist data
    if (wishlist && wishlist.length > 0) {
      return wishlist.some((product) => product._id === productId);
    }
    return false;
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
