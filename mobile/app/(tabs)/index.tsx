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

            <TouchableOpacity className="bg-surface/50 p-3 rounded-full" activeOpacity={0.7}>
              <Ionicons name="options-outline" size={22} color={"#fff"} />
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
            {/* All Products Button */}
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory("all");
                setOpenDropdown(null);
              }}
              className={`mr-3 px-5 py-3 rounded-xl border-2 ${
                selectedCategory === "all"
                  ? "bg-gold border-gold shadow-lg"
                  : "bg-surface-light border-gold/30"
              }`}
            >
              <Text
                className={`text-sm font-black uppercase tracking-wide ${
                  selectedCategory === "all" ? "text-primary" : "text-primary"
                }`}
              >
                All
              </Text>
            </TouchableOpacity>

            {/* Main Category Buttons */}
            {mainCategories.map((mainCategory) => {
              const hasSelectedSubcategory = selectedCategory.startsWith(mainCategory + " - ");
              const isMainCategorySelected = selectedCategory === mainCategory;
              const isOpen = openDropdown === mainCategory;
              
              return (
                <View key={mainCategory} className="mr-3">
                  <TouchableOpacity
                    onPress={() => {
                      // If clicking the same main category, toggle dropdown
                      // If clicking a different main category, select it and show all subcategories
                      if (isMainCategorySelected) {
                        setOpenDropdown(isOpen ? null : mainCategory);
                      } else {
                        setSelectedCategory(mainCategory);
                        setOpenDropdown(mainCategory);
                      }
                    }}
                    onLongPress={() => {
                      // Long press to select main category and show all its products
                      setSelectedCategory(mainCategory);
                      setOpenDropdown(null);
                    }}
                    className={`px-5 py-3 rounded-xl border-2 flex-row items-center ${
                      hasSelectedSubcategory || isMainCategorySelected
                        ? "bg-gold border-gold shadow-lg"
                        : "bg-surface-light border-gold/30"
                    }`}
                  >
                    <Text
                      className={`text-sm font-black uppercase tracking-wide ${
                        hasSelectedSubcategory || isMainCategorySelected ? "text-primary" : "text-primary"
                      }`}
                      numberOfLines={1}
                      style={{ maxWidth: 120 }}
                    >
                      {mainCategory}
                    </Text>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={hasSelectedSubcategory || isMainCategorySelected ? "#005a2b" : "#005a2b"}
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
            className="flex-1 bg-black/50 justify-center items-center px-6"
            activeOpacity={1}
            onPress={() => setOpenDropdown(null)}
          >
            <View
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[70%]"
              style={{ borderWidth: 2, borderColor: "#d4af37" }}
            >
              <View className="p-4 border-b-2 border-surface-dark">
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
                  const hasProducts = categoriesWithProducts.has(fullCategory);
                  const isSelected = selectedCategory === fullCategory;

                  // Show all subcategories that exist in products
                  return (
                    <TouchableOpacity
                      key={subcategory}
                      onPress={() => {
                        setSelectedCategory(fullCategory);
                        setOpenDropdown(null);
                      }}
                      className={`px-5 py-4 border-b border-gold/20 ${
                        isSelected ? "bg-gold" : "bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm font-black uppercase tracking-wide ${
                          isSelected ? "text-primary" : "text-primary"
                        }`}
                      >
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
