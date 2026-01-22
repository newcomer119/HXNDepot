import ProductsGrid from "@/components/ProductsGrid";
import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts";
import useAllProducts from "@/hooks/useAllProducts";

import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Modal } from "react-native";

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Fetch ALL products first to extract categories
  const { allProducts, isLoading: isLoadingAllProducts } = useAllProducts();

  const { 
    products, 
    isLoading, 
    isError, 
    hasMore, 
    isFetchingNextPage, 
    loadMore 
  } = useProducts({ 
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchQuery.trim() || undefined,
  });

  // Extract all unique categories from ALL products
  const categoriesWithProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      console.log("⚠️ No products loaded yet");
      return new Set<string>();
    }
    const categories = allProducts
      .map((p) => p.category)
      .filter(Boolean) as string[];
    const uniqueCategories = new Set(categories);
    console.log("✅ Loaded", allProducts.length, "products");
    console.log("✅ Found", uniqueCategories.size, "unique categories");
    console.log("Sample categories:", Array.from(uniqueCategories).slice(0, 10));
    return uniqueCategories;
  }, [allProducts]);

  // Build dynamic category structure from actual products
  const dynamicCategoryStructure = useMemo(() => {
    const structure: Record<string, Set<string>> = {};
    
    // Parse categories from products
    categoriesWithProducts.forEach((fullCategory) => {
      if (fullCategory.includes(" - ")) {
        const [mainCat, ...subCatParts] = fullCategory.split(" - ");
        const subCat = subCatParts.join(" - "); // Handle subcategories with " - " in name
        
        if (!structure[mainCat]) {
          structure[mainCat] = new Set<string>();
        }
        structure[mainCat].add(subCat);
      } else {
        // Handle categories without " - " separator (standalone categories)
        if (!structure[fullCategory]) {
          structure[fullCategory] = new Set<string>();
        }
      }
    });
    
    // Convert Sets to Arrays
    const result: Record<string, string[]> = {};
    Object.keys(structure).forEach((mainCat) => {
      result[mainCat] = Array.from(structure[mainCat]).sort();
    });
    
    // Debug: Log the structure
    console.log("📁 Category structure:", Object.keys(result));
    Object.keys(result).forEach((mainCat) => {
      console.log(`  ${mainCat}:`, result[mainCat]);
    });
    
    return result;
  }, [categoriesWithProducts]);

  // Get main categories - only show those that have products
  const mainCategories = useMemo(() => {
    return Object.keys(dynamicCategoryStructure).sort();
  }, [dynamicCategoryStructure]);

  // Products are already filtered by the API, no need for client-side filtering
  // This reduces computation and improves performance

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pb-4 pt-6 bg-background">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-text-primary text-3xl font-bold tracking-tight">HXN Building Depot</Text>
              <Text className="text-text-secondary text-sm mt-1">Premium Surfaces & Fixtures</Text>
            </View>

            <TouchableOpacity className="p-3 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} activeOpacity={0.7}>
              <Ionicons name="options-outline" size={22} color={"#005a2b"} />
            </TouchableOpacity>
          </View>

          {/* SEARCH BAR */}
          <View className="bg-surface-light border border-surface-dark flex-row items-center px-5 py-4 rounded-2xl">
            <Ionicons color={"#005a2b"} size={22} name="search" />
            <TextInput
              placeholder="Search tiles, flooring, fixtures..."
              placeholderTextColor={"#9CA3AF"}
              className="flex-1 ml-3 text-base text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* CATEGORY FILTER */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
          >
            {/* All Products Button - inline styles to avoid NativeWind/navigation-context crash on native */}
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory("all");
                setOpenDropdown(null);
              }}
              className="mr-3 px-5 py-3 rounded-xl flex-row items-center"
              style={{
                borderWidth: 2,
                borderColor: selectedCategory === "all" ? "#d4af37" : "rgba(212,175,55,0.3)",
                backgroundColor: selectedCategory === "all" ? "#d4af37" : "#F9FAFB",
                ...(selectedCategory === "all" && {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 8,
                }),
              }}
            >
              <Text className="text-sm font-black uppercase tracking-wide" style={{ color: "#005a2b" }}>
                All
              </Text>
            </TouchableOpacity>

            {/* Main Category Buttons - inline styles to avoid NativeWind/navigation-context crash on native */}
            {mainCategories.map((mainCategory) => {
              const hasSelectedSubcategory = selectedCategory.startsWith(mainCategory + " - ");
              const isMainCategorySelected = selectedCategory === mainCategory;
              const isOpen = openDropdown === mainCategory;
              const isSelected = hasSelectedSubcategory || isMainCategorySelected;

              return (
                <View key={mainCategory} className="mr-3">
                  <TouchableOpacity
                    onPress={() => {
                      if (isMainCategorySelected) {
                        setOpenDropdown(isOpen ? null : mainCategory);
                      } else {
                        setSelectedCategory(mainCategory);
                        setOpenDropdown(mainCategory);
                      }
                    }}
                    onLongPress={() => {
                      setSelectedCategory(mainCategory);
                      setOpenDropdown(null);
                    }}
                    className="px-5 py-3 rounded-xl flex-row items-center"
                    style={{
                      borderWidth: 2,
                      borderColor: isSelected ? "#d4af37" : "rgba(212,175,55,0.3)",
                      backgroundColor: isSelected ? "#d4af37" : "#F9FAFB",
                      ...(isSelected && {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        elevation: 8,
                      }),
                    }}
                  >
                    <Text
                      className="text-sm font-black uppercase tracking-wide"
                      style={{ color: "#005a2b", maxWidth: 120 }}
                      numberOfLines={1}
                    >
                      {mainCategory}
                    </Text>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#005a2b"
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Subcategory Modal */}
        <Modal
          visible={openDropdown !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setOpenDropdown(null)}
        >
          <TouchableOpacity
            className="flex-1 justify-center items-center px-6"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            activeOpacity={1}
            onPress={() => setOpenDropdown(null)}
          >
            <View
              className="bg-white rounded-2xl w-full max-w-sm max-h-[70%]"
              style={{
                borderWidth: 2,
                borderColor: "#d4af37",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
                elevation: 16,
              }}
            >
              <View className="p-4" style={{ borderBottomWidth: 2, borderBottomColor: "#E5E7EB" }}>
                <View className="flex-row items-center justify-between">
                  <Text className="text-primary text-lg font-black uppercase tracking-wide">
                    {openDropdown}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setOpenDropdown(null)}
                    className="p-2"
                  >
                    <Ionicons name="close" size={24} color="#005a2b" />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView className="max-h-[400px]">
                {openDropdown && dynamicCategoryStructure[openDropdown]?.map((subcategory) => {
                  const fullCategory = `${openDropdown} - ${subcategory}`;
                  const isSelected = selectedCategory === fullCategory;

                  return (
                    <TouchableOpacity
                      key={subcategory}
                      onPress={() => {
                        setSelectedCategory(fullCategory);
                        setOpenDropdown(null);
                      }}
                      className="px-5 py-4"
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(212,175,55,0.2)",
                        backgroundColor: isSelected ? "#d4af37" : "#fff",
                      }}
                    >
                      <Text className="text-sm font-black uppercase tracking-wide" style={{ color: "#005a2b" }}>
                        {subcategory}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">Premium Products</Text>
            <Text className="text-text-secondary text-sm">{products.length} items</Text>
          </View>

          {/* PRODUCTS GRID */}
          <ProductsGrid 
            products={products} 
            isLoading={isLoading} 
            isError={isError}
            hasMore={hasMore}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={loadMore}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ShopScreen;
