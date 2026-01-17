import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct";
import useWishlist from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import * as WebBrowser from "expo-web-browser";

const { width } = Dimensions.get("window");
const TILESVIEW_TOKEN = "NTE4NTE3dGlsZXNwcmV2aWV3XzE5OTQ=";

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isError, isLoading } = useProduct(id);
  const { addToCart, isAddingToCart } = useCart();

  const { isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } =
    useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      { productId: product._id, quantity },
      {
        onSuccess: () => Alert.alert("Success", `${product.name} added to cart!`),
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
        },
      }
    );
  };

  if (isLoading) return <LoadingUI />;
  if (isError || !product) return <ErrorUI />;

  // Get product images - handle both 'images' and 'image' fields
  const productImages = product.images || product.image || [];
  const inStock = (product.stock ?? 1) > 0;
  const hasOfferPrice = product.offerPrice && product.offerPrice < product.price;
  
  const handleViewInRoom = async () => {
    // Open TilesView in browser
    const tilesViewUrl = `https://tilesview.ai/app/login.php?login_backend=${TILESVIEW_TOKEN}`;
    try {
      await WebBrowser.openBrowserAsync(tilesViewUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: "#005a2b",
      });
    } catch (error) {
      Alert.alert("Error", "Could not open TilesView. Please try again.");
    }
  };

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0 z-10 px-6 pt-12 pb-4 flex-row items-center justify-between">
        <TouchableOpacity
          className="bg-white/90 backdrop-blur-xl w-12 h-12 rounded-full items-center justify-center shadow-lg"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#005a2b" />
        </TouchableOpacity>

        <TouchableOpacity
          className={`w-12 h-12 rounded-full items-center justify-center shadow-lg ${
            isInWishlist(product._id) ? "bg-gold" : "bg-white/90 backdrop-blur-xl"
          }`}
          onPress={() => toggleWishlist(product._id)}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
          activeOpacity={0.7}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator size="small" color="#005a2b" />
          ) : (
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={24}
              color={isInWishlist(product._id) ? "#005a2b" : "#005a2b"}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* IMAGE GALLERY */}
        <View className="relative bg-background-lighter">
          {productImages.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / width);
                  setSelectedImageIndex(index);
                }}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={width}
                snapToAlignment="center"
              >
                {productImages.map((image: string, index: number) => (
                  <View key={index} style={{ width }}>
                    <Image 
                      source={{ uri: typeof image === 'string' ? image : image }} 
                      style={{ width, height: 450 }} 
                      contentFit="cover"
                      transition={200}
                    />
                  </View>
                ))}
              </ScrollView>

              {/* Image Indicators */}
              {productImages.length > 1 && (
                <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                  {productImages.map((_: any, index: number) => (
                    <View
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === selectedImageIndex ? "bg-gold w-6" : "bg-white/70 w-2"
                      }`}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={{ width, height: 450 }} className="items-center justify-center bg-surface-light">
              <Ionicons name="image-outline" size={64} color="#9CA3AF" />
              <Text className="text-text-secondary mt-4">No image available</Text>
            </View>
          )}
        </View>

        {/* PRODUCT INFO */}
        <View className="p-6 bg-background">
          {/* Category */}
          <View className="flex-row items-center mb-4">
            <View className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
              <Text className="text-primary text-xs font-bold uppercase tracking-wide">
                {product.category?.split(" - ")[0] || product.category || "Product"}
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text className="text-text-primary text-3xl font-black mb-4 leading-tight">{product.name}</Text>

          {/* Rating & Stock Status */}
          <View className="flex-row items-center flex-wrap mb-4 gap-3">
            {(product.averageRating !== undefined || product.totalReviews !== undefined) && (
              <View className="flex-row items-center bg-surface-light border border-surface-dark px-4 py-2 rounded-full">
                <Ionicons name="star" size={16} color="#FFC107" />
                <Text className="text-text-primary font-bold ml-1 mr-2">
                  {product.averageRating?.toFixed(1) || "0.0"}
                </Text>
                <Text className="text-text-secondary text-xs">
                  ({product.totalReviews || 0} reviews)
                </Text>
              </View>
            )}
            {inStock ? (
              <View className="flex-row items-center bg-green-50 border border-green-200 px-4 py-2 rounded-full">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-green-700 font-semibold text-sm">
                  {product.stock ? `${product.stock} in stock` : "In Stock"}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center bg-red-50 border border-red-200 px-4 py-2 rounded-full">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                <Text className="text-red-700 font-semibold text-sm">Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Price */}
          <View className="mb-6">
            {product.offerPrice === 0 || product.price === 0 ? (
              <TouchableOpacity
                className="bg-primary px-6 py-4 rounded-2xl items-center"
                activeOpacity={0.8}
                onPress={() => router.push("/(tabs)/contact")}
              >
                <Ionicons name="call-outline" size={24} color="#FFFFFF" />
                <Text className="text-white text-lg font-black mt-2 uppercase tracking-wide">
                  Contact the Store
                </Text>
                <Text className="text-white/90 text-sm mt-1">
                  For pricing information
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row items-center gap-3">
                {hasOfferPrice ? (
                  <>
                    <Text className="text-text-secondary text-xl line-through">
                      ₹{product.price.toLocaleString()}
                    </Text>
                    <Text className="text-primary text-4xl font-black">
                      ₹{product.offerPrice.toLocaleString()}
                    </Text>
                    <View className="bg-red-100 px-3 py-1 rounded-full">
                      <Text className="text-red-600 text-xs font-bold">
                        {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text className="text-primary text-4xl font-black">₹{product.price.toLocaleString()}</Text>
                )}
              </View>
            )}
          </View>

          {/* View in Your Room Button */}
          <TouchableOpacity
            className="bg-gold border-2 border-gold rounded-2xl px-6 py-4 flex-row items-center justify-center mb-6 shadow-lg"
            onPress={handleViewInRoom}
            activeOpacity={0.8}
          >
            <Ionicons name="home-outline" size={24} color="#005a2b" />
            <Text className="text-primary font-black text-base ml-2 uppercase tracking-wide">
              View in Your Room
            </Text>
          </TouchableOpacity>

          {/* Quantity - Only show if product has price */}
          {(product.offerPrice !== 0 && product.price !== 0) && (
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-3">Quantity</Text>

              <View className="flex-row items-center">
                <TouchableOpacity
                  className="bg-surface-dark border border-surface-dark rounded-full w-12 h-12 items-center justify-center"
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  activeOpacity={0.7}
                  disabled={!inStock}
                >
                  <Ionicons name="remove" size={24} color={inStock ? "#005a2b" : "#9CA3AF"} />
                </TouchableOpacity>

                <View className="bg-surface-light border border-surface-dark rounded-xl px-6 py-2 mx-4 min-w-[60px] items-center">
                  <Text className="text-text-primary text-xl font-bold">{quantity}</Text>
                </View>

                <TouchableOpacity
                  className="bg-gold border border-gold rounded-full w-12 h-12 items-center justify-center shadow-sm"
                  onPress={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                  activeOpacity={0.7}
                  disabled={!inStock || (product.stock ? quantity >= product.stock : false)}
                >
                  <Ionicons
                    name="add"
                    size={24}
                    color={!inStock || (product.stock ? quantity >= product.stock : false) ? "#9CA3AF" : "#005a2b"}
                  />
                </TouchableOpacity>
              </View>

              {product.stock && quantity >= product.stock && inStock && (
                <Text className="text-orange-500 text-sm mt-2">Maximum stock reached</Text>
              )}
            </View>
          )}

          {/* Description */}
          <View className="mb-6">
            <Text className="text-text-primary text-xl font-black mb-3">Description</Text>
            <Text className="text-text-secondary text-base leading-7">{product.description}</Text>
          </View>

          {/* Additional Info */}
          {product.additionalInfo && (
            <View className="mb-6">
              <Text className="text-text-primary text-xl font-black mb-3">Additional Information</Text>
              <Text className="text-text-secondary text-base leading-7">{product.additionalInfo}</Text>
            </View>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <View className="mb-6">
              <Text className="text-text-primary text-xl font-black mb-3">Available Colors</Text>
              <View className="flex-row flex-wrap gap-3">
                {product.colors.map((color: string, index: number) => (
                  <View
                    key={index}
                    className="bg-surface-light border border-surface-dark px-4 py-2 rounded-full"
                  >
                    <Text className="text-text-primary text-sm font-semibold">{color}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {product.offerPrice === 0 || product.price === 0 ? (
        <View className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-surface-dark px-6 py-4 pb-8 shadow-2xl">
          <TouchableOpacity
            className="bg-primary rounded-2xl px-6 py-4 flex-row items-center justify-center shadow-lg"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/contact")}
          >
            <Ionicons name="call-outline" size={22} color="#FFFFFF" />
            <Text className="text-white font-black text-base ml-2">
              Contact the Store
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-surface-dark px-6 py-4 pb-8 shadow-2xl">
          <View className="flex-row items-center gap-4">
            <View className="flex-1">
              <Text className="text-text-secondary text-xs mb-1 uppercase tracking-wide">Total Price</Text>
              <Text className="text-primary text-2xl font-black">
                ₹{((hasOfferPrice ? product.offerPrice : product.price) * quantity).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              className={`rounded-2xl px-6 py-4 flex-row items-center shadow-lg ${
                !inStock ? "bg-surface-dark" : "bg-primary"
              }`}
              activeOpacity={0.8}
              onPress={handleAddToCart}
              disabled={!inStock || isAddingToCart}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cart" size={22} color="#FFFFFF" />
                  <Text className="text-white font-black text-base ml-2">
                    {!inStock ? "Out of Stock" : "Add to Cart"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

    </SafeScreen>
  );
};

export default ProductDetailScreen;

function ErrorUI() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#d4af37" />
        <Text className="text-text-primary font-semibold text-xl mt-4">Product not found</Text>
        <Text className="text-text-secondary text-center mt-2">
          This product may have been removed or doesn&apos;t exist
        </Text>
        <TouchableOpacity
          className="bg-primary rounded-2xl px-6 py-3 mt-6"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

function LoadingUI() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#005a2b" />
        <Text className="text-text-secondary mt-4">Loading product...</Text>
      </View>
    </SafeScreen>
  );
}
