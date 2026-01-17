import ProductsGrid from "@/components/ProductsGrid";
import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts";

import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Modal } from "react-native";

// Category structure matching the website
const categoryStructure = {
  "Bathroom Products": [
    "Toilets",
    "Floating Vanities",
    "Free Standing Vanities",
    "Plain & LED Mirrors",
    "Faucets",
    "Towel Bar Sets",
    "Free Standing Tubs",
    "Tub Faucets",
    "Shower Glass",
    "Shower Drains",
    "Shower Faucets",
    "Tile Edges",
  ],
  Floorings: [
    "Solid/HardWood Floorings",
    "Engineering Wood Floorings",
    "Vinyl Floorings",
    "Laminate Floorings",
  ],
  Tiles: ["Porcelain Tiles", "Mosaic Tiles"],
  Kitchens: [
    "Melamine Cabinets",
    "MDF Laminates Cabinets",
    "MDF Painted Cabinets",
    "Solid Wood Painted Cabinets",
  ],
  Countertops: [
    "Quartz Countertop",
    "Granite Countertop",
    "Porcelain Countertop",
  ],
  Lightning: [
    "Potlights",
    "Chandeliers",
    "Lamps",
    "Vanity Lights",
    "LED Mirrors",
    "Island Lights",
  ],
};

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  // Get categories that have products
  const categoriesWithProducts = useMemo(() => {
    if (!products) return new Set<string>();
    return new Set(products.map((p) => p.category).filter(Boolean));
  }, [products]);

  // Filter main categories to only show those that have products
  const mainCategories = useMemo(() => {
    return Object.keys(categoryStructure).filter((mainCat) => {
      return categoryStructure[mainCat as keyof typeof categoryStructure].some((subCat) => {
        const fullCategory = `${mainCat} - ${subCat}`;
        return categoriesWithProducts.has(fullCategory);
      });
    });
  }, [categoriesWithProducts]);

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
                  ? "bg-primary border-gold"
                  : "bg-surface-light border-surface-dark"
              }`}
            >
              <Text
                className={`text-sm font-black uppercase tracking-wide ${
                  selectedCategory === "all" ? "text-white" : "text-primary"
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
                        ? "bg-primary border-gold"
                        : "bg-surface-light border-surface-dark"
                    }`}
                  >
                    <Text
                      className={`text-sm font-black uppercase tracking-wide ${
                        hasSelectedSubcategory || isMainCategorySelected ? "text-white" : "text-primary"
                      }`}
                      numberOfLines={1}
                      style={{ maxWidth: 120 }}
                    >
                      {mainCategory}
                    </Text>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={hasSelectedSubcategory || isMainCategorySelected ? "#FFFFFF" : "#005a2b"}
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
                {openDropdown && categoryStructure[openDropdown as keyof typeof categoryStructure].map((subcategory) => {
                  const fullCategory = `${openDropdown} - ${subcategory}`;
                  const hasProducts = categoriesWithProducts.has(fullCategory);
                  const isSelected = selectedCategory === fullCategory;

                  if (!hasProducts) return null;

                  return (
                    <TouchableOpacity
                      key={subcategory}
                      onPress={() => {
                        setSelectedCategory(fullCategory);
                        setOpenDropdown(null);
                      }}
                      className={`px-5 py-4 border-b border-surface-dark ${
                        isSelected ? "bg-primary" : "bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm font-black uppercase tracking-wide ${
                          isSelected ? "text-white" : "text-primary"
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
