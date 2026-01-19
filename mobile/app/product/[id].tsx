import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct";
import useWishlist from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useRef } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
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
  const scrollY = useRef(new Animated.Value(0)).current;

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
  const discountPercentage = hasOfferPrice && product.price
    ? Math.round(((product.price - (product.offerPrice || 0)) / product.price) * 100)
    : 0;
  
  const handleViewInRoom = async () => {
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

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeScreen>
      {/* FLOATING HEADER */}
      <Animated.View 
        className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-xl border-b border-gold/20"
        style={{ opacity: headerOpacity }}
      >
        <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
          <TouchableOpacity
            className="bg-gold/20 w-10 h-10 rounded-full items-center justify-center"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#005a2b" />
          </TouchableOpacity>
          <Text className="text-primary font-black text-base flex-1 mx-4" numberOfLines={1}>
            {product.name}
          </Text>
          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isInWishlist(product._id) ? "bg-gold" : "bg-gold/20"
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
                size={22}
                color={isInWishlist(product._id) ? "#005a2b" : "#005a2b"}
              />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* TOP ACTION BUTTONS */}
      <View className="absolute top-12 left-0 right-0 z-10 px-6 flex-row items-center justify-between">
        <TouchableOpacity
          className="bg-white/95 backdrop-blur-xl w-11 h-11 rounded-full items-center justify-center shadow-xl border-2 border-gold/30"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#005a2b" />
        </TouchableOpacity>

        <TouchableOpacity
          className={`w-11 h-11 rounded-full items-center justify-center shadow-xl border-2 ${
            isInWishlist(product._id) ? "bg-gold border-gold" : "bg-white/95 backdrop-blur-xl border-gold/30"
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
              size={22}
              color={isInWishlist(product._id) ? "#005a2b" : "#005a2b"}
            />
          )}
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
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
                      style={{ width, height: 480 }} 
                      contentFit="cover"
                      transition={200}
                    />
                  </View>
                ))}
              </ScrollView>

              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <View className="absolute top-4 left-4 bg-gold px-4 py-2 rounded-full shadow-xl border-2 border-white">
                  <Text className="text-primary font-black text-sm">
                    {discountPercentage}% OFF
                  </Text>
                </View>
              )}

              {/* Image Indicators */}
              {productImages.length > 1 && (
                <View className="absolute bottom-6 left-0 right-0 flex-row justify-center gap-2">
                  {productImages.map((_: any, index: number) => (
                    <View
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === selectedImageIndex ? "bg-gold w-8 border-2 border-white" : "bg-white/70 w-2"
                      }`}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={{ width, height: 480 }} className="items-center justify-center bg-surface-light">
              <Ionicons name="image-outline" size={64} color="#d4af37" />
              <Text className="text-text-secondary mt-4">No image available</Text>
            </View>
          )}
        </View>

        {/* PRODUCT INFO */}
        <View className="p-6 bg-background">
          {/* Category Badge */}
          <View className="flex-row items-center mb-4">
            <View className="bg-gold/20 border-2 border-gold px-5 py-2.5 rounded-full">
              <Text className="text-primary text-xs font-black uppercase tracking-wider">
                {product.category?.split(" - ")[0] || product.category || "Product"}
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text className="text-text-primary text-3xl font-black mb-4 leading-tight">
            {product.name}
          </Text>

          {/* Rating & Stock Status */}
          <View className="flex-row items-center flex-wrap mb-5 gap-3">
            {(product.averageRating !== undefined || product.totalReviews !== undefined) && (
              <View className="flex-row items-center bg-gold/10 border-2 border-gold/30 px-4 py-2.5 rounded-full">
                <Ionicons name="star" size={18} color="#FFC107" />
                <Text className="text-primary font-black ml-2 mr-2 text-base">
                  {product.averageRating?.toFixed(1) || "0.0"}
                </Text>
                <View className="h-4 w-px bg-gold/30 mx-1" />
                <Text className="text-text-secondary text-sm">
                  {product.totalReviews || 0} reviews
                </Text>
              </View>
            )}
            {inStock ? (
              <View className="flex-row items-center bg-green-50 border-2 border-green-300 px-4 py-2.5 rounded-full">
                <View className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2" />
                <Text className="text-green-700 font-black text-sm">
                  {product.stock ? `${product.stock} in stock` : "In Stock"}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center bg-red-50 border-2 border-red-300 px-4 py-2.5 rounded-full">
                <View className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2" />
                <Text className="text-red-700 font-black text-sm">Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Price Section - Enhanced */}
          <View className="mb-6 pb-6 border-b-2 border-gold/20">
            {product.offerPrice === 0 || product.price === 0 ? (
              <TouchableOpacity
                className="bg-primary rounded-2xl px-6 py-5 items-center border-2 border-gold shadow-xl"
                activeOpacity={0.8}
                onPress={() => router.push("/(tabs)/contact")}
              >
                <Ionicons name="call-outline" size={28} color="#FFFFFF" />
                <Text className="text-white text-xl font-black mt-2 uppercase tracking-wide">
                  Contact the Store
                </Text>
                <Text className="text-white/90 text-sm mt-1">
                  For pricing information
                </Text>
              </TouchableOpacity>
            ) : (
              <View>
                <View className="flex-row items-baseline gap-3 mb-2">
                  {hasOfferPrice && product.offerPrice ? (
                    <>
                      <Text className="text-text-secondary text-xl line-through">
                        ₹{product.price.toLocaleString()}
                      </Text>
                      <Text className="text-primary text-5xl font-black">
                        ₹{product.offerPrice.toLocaleString()}
                      </Text>
                    </>
                  ) : (
                    <Text className="text-primary text-5xl font-black">
                      ₹{product.price.toLocaleString()}
                    </Text>
                  )}
                </View>
                {hasOfferPrice && (
                  <View className="flex-row items-center gap-2 mt-2">
                    <View className="bg-gold px-3 py-1.5 rounded-full border-2 border-primary">
                      <Text className="text-primary text-xs font-black">
                        Save ₹{(product.price - (product.offerPrice || 0)).toLocaleString()}
                      </Text>
                    </View>
                    <Text className="text-text-secondary text-sm">
                      You save {discountPercentage}%
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* View in Your Room Button - Enhanced */}
          <TouchableOpacity
            className="bg-gold border-2 border-gold rounded-2xl px-6 py-5 flex-row items-center justify-center mb-6 shadow-xl"
            onPress={handleViewInRoom}
            activeOpacity={0.8}
          >
            <Ionicons name="home" size={26} color="#005a2b" />
            <Text className="text-primary font-black text-lg ml-3 uppercase tracking-wide">
              View in Your Room
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#005a2b" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          {/* Quantity Selector - Enhanced */}
          {(product.offerPrice !== 0 && product.price !== 0) && (
            <View className="mb-6 pb-6 border-b-2 border-gold/20">
              <Text className="text-text-primary text-lg font-black mb-4">Quantity</Text>

              <View className="flex-row items-center justify-between bg-gold/10 border-2 border-gold/30 rounded-2xl p-4">
                <TouchableOpacity
                  className="bg-white border-2 border-gold rounded-full w-14 h-14 items-center justify-center shadow-lg"
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  activeOpacity={0.7}
                  disabled={!inStock}
                >
                  <Ionicons name="remove" size={26} color={inStock ? "#005a2b" : "#9CA3AF"} />
                </TouchableOpacity>

                <View className="bg-white border-2 border-gold rounded-xl px-8 py-3 min-w-[80px] items-center">
                  <Text className="text-primary text-2xl font-black">{quantity}</Text>
                </View>

                <TouchableOpacity
                  className="bg-gold border-2 border-gold rounded-full w-14 h-14 items-center justify-center shadow-lg"
                  onPress={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                  activeOpacity={0.7}
                  disabled={!inStock || (product.stock ? quantity >= product.stock : false)}
                >
                  <Ionicons
                    name="add"
                    size={26}
                    color={!inStock || (product.stock ? quantity >= product.stock : false) ? "#9CA3AF" : "#005a2b"}
                  />
                </TouchableOpacity>
              </View>

              {product.stock && quantity >= product.stock && inStock && (
                <Text className="text-gold text-sm mt-3 font-semibold text-center">
                  Maximum stock reached
                </Text>
              )}
            </View>
          )}

          {/* Key Features Section */}
          <View className="mb-6 pb-6 border-b-2 border-gold/20">
            <Text className="text-text-primary text-xl font-black mb-4">Key Features</Text>
            <View>
              <View className="flex-row items-center mb-3">
                <View className="w-2 h-2 bg-gold rounded-full mr-3" />
                <Text className="text-text-secondary text-base flex-1">
                  Premium quality materials
                </Text>
              </View>
              <View className="flex-row items-center mb-3">
                <View className="w-2 h-2 bg-gold rounded-full mr-3" />
                <Text className="text-text-secondary text-base flex-1">
                  Professional installation support
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-gold rounded-full mr-3" />
                <Text className="text-text-secondary text-base flex-1">
                  Free delivery on orders above ₹10,000
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6 pb-6 border-b-2 border-gold/20">
            <Text className="text-text-primary text-xl font-black mb-4">Description</Text>
            <Text className="text-text-secondary text-base leading-7">{product.description}</Text>
          </View>

          {/* Additional Info */}
          {product.additionalInfo && (
            <View className="mb-6 pb-6 border-b-2 border-gold/20">
              <Text className="text-text-primary text-xl font-black mb-4">Additional Information</Text>
              <Text className="text-text-secondary text-base leading-7">{product.additionalInfo}</Text>
            </View>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <View className="mb-6">
              <Text className="text-text-primary text-xl font-black mb-4">Available Colors</Text>
              <View className="flex-row flex-wrap gap-3">
                {product.colors.map((color: string, index: number) => (
                  <View
                    key={index}
                    className="bg-gold/20 border-2 border-gold px-5 py-3 rounded-full"
                  >
                    <Text className="text-primary text-sm font-black">{color}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Shipping & Returns Info */}
          <View className="bg-gold/10 border-2 border-gold/30 rounded-2xl p-5 mb-6">
            <Text className="text-primary text-lg font-black mb-3">Shipping & Returns</Text>
            <View>
              <View className="flex-row items-start mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#d4af37" style={{ marginTop: 2, marginRight: 8 }} />
                <Text className="text-text-secondary text-sm flex-1">
                  Free shipping on orders above ₹10,000
                </Text>
              </View>
              <View className="flex-row items-start mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#d4af37" style={{ marginTop: 2, marginRight: 8 }} />
                <Text className="text-text-secondary text-sm flex-1">
                  Easy returns within 7 days
                </Text>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={20} color="#d4af37" style={{ marginTop: 2, marginRight: 8 }} />
                <Text className="text-text-secondary text-sm flex-1">
                  Secure payment options
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Bottom Action Bar - Enhanced */}
      {product.offerPrice === 0 || product.price === 0 ? (
        <View className="absolute bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t-2 border-gold px-6 py-5 pb-8 shadow-2xl">
          <TouchableOpacity
            className="bg-primary rounded-2xl px-6 py-5 flex-row items-center justify-center shadow-xl border-2 border-gold"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/contact")}
          >
            <Ionicons name="call" size={24} color="#FFFFFF" />
            <Text className="text-white font-black text-lg ml-3 uppercase tracking-wide">
              Contact the Store
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="absolute bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t-2 border-gold px-6 py-5 pb-8 shadow-2xl">
          <View className="flex-row items-center gap-4">
            <View className="flex-1">
              <Text className="text-text-secondary text-xs mb-1 uppercase tracking-wide font-semibold">Total Price</Text>
              <Text className="text-primary text-3xl font-black">
                ₹{((hasOfferPrice && product.offerPrice ? product.offerPrice : product.price) * quantity).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              className={`rounded-2xl px-8 py-5 flex-row items-center shadow-xl border-2 ${
                !inStock 
                  ? "bg-surface-dark border-surface-dark" 
                  : "bg-gold border-gold"
              }`}
              activeOpacity={0.8}
              onPress={handleAddToCart}
              disabled={!inStock || isAddingToCart}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color="#005a2b" />
              ) : (
                <>
                  <Ionicons name="cart" size={24} color="#005a2b" />
                  <Text className="text-primary font-black text-lg ml-2 uppercase tracking-wide">
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
        <View className="bg-gold/20 w-24 h-24 rounded-full items-center justify-center mb-6">
          <Ionicons name="alert-circle-outline" size={64} color="#d4af37" />
        </View>
        <Text className="text-text-primary font-black text-xl mt-4">Product not found</Text>
        <Text className="text-text-secondary text-center mt-2">
          This product may have been removed or doesn&apos;t exist
        </Text>
        <TouchableOpacity
          className="bg-gold border-2 border-gold rounded-2xl px-8 py-4 mt-6 shadow-lg"
          onPress={() => router.back()}
        >
          <Text className="text-primary font-black uppercase tracking-wide">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

function LoadingUI() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#d4af37" />
        <Text className="text-text-secondary mt-4 font-semibold">Loading product...</Text>
      </View>
    </SafeScreen>
  );
}
