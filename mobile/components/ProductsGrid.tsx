import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ProductsGridSkeleton } from "./ProductSkeleton";

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

const ProductsGrid = ({ 
  products, 
  isLoading, 
  isError, 
  hasMore = false, 
  isFetchingNextPage = false,
  onLoadMore 
}: ProductsGridProps) => {
  const router = useRouter();
  
  // Lazy load wishlist - only load when user interacts with wishlist
  const { isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } =
    useWishlist();

  // Lazy load cart - only load when user adds to cart
  const { isAddingToCart, addToCart } = useCart();

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert("Success", `${productName} added to cart!`);
        },
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
        },
      }
    );
  };

  const handleProductPress = (productId: string) => {
    try {
      router.push(`/product/${productId}`);
    } catch (error: any) {
      console.error("Navigation error:", error);
    }
  };

  const handleContactPress = () => {
    try {
      router.push("/(tabs)/contact");
    } catch (error: any) {
      console.error("Navigation error:", error);
    }
  };

  const renderProduct = ({ item: product }: { item: Product }) => (
    <TouchableOpacity
      className="bg-surface-light border-2 border-gold/20 rounded-3xl overflow-hidden mb-3 shadow-lg"
      style={{ width: "48%" }}
      activeOpacity={0.8}
      onPress={() => handleProductPress(product._id)}
    >
      <View className="relative">
        <Image
          source={{ 
            uri: product.images?.[0] || product.image?.[0] || "https://via.placeholder.com/300"
          }}
          className="w-full h-44 bg-background-lighter"
          resizeMode="cover"
        />

        <TouchableOpacity
          className={`absolute top-3 right-3 backdrop-blur-xl p-2.5 rounded-full shadow-lg border-2 ${
            isInWishlist(product._id) 
              ? "bg-gold border-gold" 
              : "bg-white/95 border-gold/30"
          }`}
          activeOpacity={0.7}
          onPress={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator size="small" color="#005a2b" />
          ) : (
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={18}
              color={isInWishlist(product._id) ? "#005a2b" : "#005a2b"}
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text className="text-text-secondary text-xs mb-1">{product.category}</Text>
        <Text className="text-text-primary font-bold text-sm mb-2" numberOfLines={2}>
          {product.name}
        </Text>

        {(product.averageRating !== undefined || product.totalReviews !== undefined) && (
          <View className="flex-row items-center mb-2 bg-gold/10 px-2 py-1 rounded-full self-start">
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text className="text-primary text-xs font-black ml-1">
              {product.averageRating?.toFixed(1) || "0.0"}
            </Text>
            <Text className="text-text-secondary text-xs ml-1">
              ({product.totalReviews || 0})
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between">
          {product.offerPrice === 0 || product.price === 0 ? (
            <TouchableOpacity
              className="bg-primary border-2 border-gold px-4 py-2 rounded-xl"
              activeOpacity={0.7}
              onPress={(e) => {
                e.stopPropagation();
                handleContactPress();
              }}
            >
              <Text className="text-white text-xs font-black uppercase tracking-wide">Contact Store</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-1">
              {product.offerPrice && product.offerPrice < product.price ? (
                <View>
                  <Text className="text-text-secondary text-xs line-through">
                    ₹{product.price.toLocaleString()}
                  </Text>
                  <Text className="text-primary font-black text-lg">
                    ₹{product.offerPrice.toLocaleString()}
                  </Text>
                </View>
              ) : (
                <Text className="text-primary font-black text-lg">
                  ₹{(product.offerPrice || product.price).toLocaleString()}
                </Text>
              )}
            </View>
          )}

          {product.offerPrice !== 0 && product.price !== 0 && (
            <TouchableOpacity
              className="bg-gold border-2 border-gold rounded-full w-10 h-10 items-center justify-center shadow-lg"
              activeOpacity={0.7}
              onPress={(e) => {
                e.stopPropagation();
                handleAddToCart(product._id, product.name);
              }}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color="#005a2b" />
              ) : (
                <Ionicons name="add" size={20} color="#005a2b" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && products.length === 0) {
    return <ProductsGridSkeleton count={6} />;
  }

  if (isError && products.length === 0) {
    return (
      <View className="py-20 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color="#d4af37" />
        <Text className="text-text-primary font-semibold mt-4">Failed to load products</Text>
        <Text className="text-text-secondary text-sm mt-2">Please try again later</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        ListEmptyComponent={NoProductsFound}
        ListFooterComponent={() => {
          if (isFetchingNextPage) {
            return (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#005a2b" />
                <Text className="text-text-secondary text-xs mt-2">Loading more...</Text>
              </View>
            );
          }
          if (hasMore && onLoadMore) {
            return (
              <View className="py-4 items-center">
                <TouchableOpacity
                  onPress={onLoadMore}
                  className="bg-gold border-2 border-gold px-8 py-3 rounded-xl shadow-lg"
                >
                  <Text className="text-primary font-black uppercase tracking-wide">Load More</Text>
                </TouchableOpacity>
              </View>
            );
          }
          return null;
        }}
      />
    </>
  );
};

export default ProductsGrid;

function NoProductsFound() {
  return (
    <View className="py-20 items-center justify-center">
      <Ionicons name="search-outline" size={48} color={"#9CA3AF"} />
      <Text className="text-text-primary font-semibold mt-4">No products found</Text>
      <Text className="text-text-secondary text-sm mt-2">Try adjusting your filters</Text>
    </View>
  );
}
