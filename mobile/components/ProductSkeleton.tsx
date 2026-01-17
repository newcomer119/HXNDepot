import { View } from "react-native";

const ProductSkeleton = () => {
  return (
    <View className="bg-surface-light border border-surface-dark rounded-3xl overflow-hidden mb-3" style={{ width: "48%" }}>
      {/* Image skeleton */}
      <View className="w-full h-44 bg-background-lighter animate-pulse" />
      
      {/* Content skeleton */}
      <View className="p-3">
        <View className="h-3 w-20 bg-background-lighter rounded mb-2 animate-pulse" />
        <View className="h-4 w-full bg-background-lighter rounded mb-2 animate-pulse" />
        <View className="h-4 w-3/4 bg-background-lighter rounded mb-3 animate-pulse" />
        <View className="flex-row items-center justify-between">
          <View className="h-6 w-16 bg-background-lighter rounded animate-pulse" />
          <View className="w-8 h-8 bg-background-lighter rounded-full animate-pulse" />
        </View>
      </View>
    </View>
  );
};

export const ProductsGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <View className="flex-row flex-wrap justify-between">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </View>
  );
};

export default ProductSkeleton;
