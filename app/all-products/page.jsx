"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingCart, Plus, Minus, ChevronDown, Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

export default function ProductsPage() {
  const { products, isLoading, addToCart, currency } = useAppContext();
  const { updateQuantity, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingAllProducts, setIsLoadingAllProducts] = useState(true);

  // Fetch ALL products first to extract categories
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoadingAllProducts(true);
      try {
        const { data } = await axios.get("/api/product/list?page=1&limit=10000");
        if (data.success && data.products) {
          setAllProducts(data.products);
          console.log("✅ Loaded", data.products.length, "products for category extraction");
        }
      } catch (error) {
        console.error("Error fetching all products:", error);
        // Fallback to current products
        setAllProducts(products);
      }
      setIsLoadingAllProducts(false);
    };
    fetchAllProducts();
  }, []);

  // Extract all unique categories from ALL products
  const categoriesWithProducts = useMemo(() => {
    const productsToUse = allProducts.length > 0 ? allProducts : products;
    const categories = productsToUse
      .map((p) => p.category)
      .filter(Boolean);
    const uniqueCategories = new Set(categories);
    console.log("✅ Found", uniqueCategories.size, "unique categories from", productsToUse.length, "products");
    return uniqueCategories;
  }, [allProducts, products]);

  // Build dynamic category structure from actual products
  const dynamicCategoryStructure = useMemo(() => {
    const structure = {};
    
    // Parse categories from products
    categoriesWithProducts.forEach((fullCategory) => {
      if (fullCategory.includes(" - ")) {
        const [mainCat, ...subCatParts] = fullCategory.split(" - ");
        const subCat = subCatParts.join(" - "); // Handle subcategories with " - " in name
        
        if (!structure[mainCat]) {
          structure[mainCat] = new Set();
        }
        structure[mainCat].add(subCat);
      } else {
        // Handle categories without " - " separator (standalone categories)
        if (!structure[fullCategory]) {
          structure[fullCategory] = new Set();
        }
      }
    });
    
    // Convert Sets to Arrays and sort
    const result = {};
    Object.keys(structure).forEach((mainCat) => {
      result[mainCat] = Array.from(structure[mainCat]).sort();
    });
    
    console.log("📁 Category structure:", Object.keys(result));
    Object.keys(result).forEach((mainCat) => {
      console.log(`  ${mainCat}:`, result[mainCat]);
    });
    
    return result;
  }, [categoriesWithProducts]);

  // Get main categories - only show those that have products
  const mainCategories = Object.keys(dynamicCategoryStructure).sort();

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleDropdown = (mainCategory) => {
    setOpenDropdown(openDropdown === mainCategory ? null : mainCategory);
  };

  const handleCategorySelect = (fullCategory) => {
    setSelectedCategory(fullCategory);
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(".category-dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleAddToCart = (product) => {
    addToCart(product._id);
    toast.success("Item added to cart");
  };

  const getCartQuantity = (productId) => {
    const cartItem = cart.find((item) => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
            alt="Products background"
            fill
            className="object-cover opacity-5 grayscale"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span
              className="text-sm font-black tracking-[0.4em] uppercase mb-4 block"
              style={{
                color: colors.gold,
                fontFamily: "var(--font-montserrat)",
              }}
            >
              Our Collection
            </span>
            <h1
              className="text-5xl md:text-7xl font-black mb-8 leading-tight"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <span style={{ color: colors.green }}>Premium </span>
              <span style={{ color: colors.gold }}>Products</span>
            </h1>
            <p
              className="text-lg md:text-xl font-bold leading-relaxed"
              style={{ color: colors.green }}
            >
              Elevate your architectural vision with our world class collections
              and fixtures.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": colors.gold }}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* All Products Button */}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setOpenDropdown(null);
                }}
                className={`px-6 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${
                  selectedCategory === "all"
                    ? "text-white shadow-lg"
                    : "border-2 hover:bg-slate-50"
                }`}
                style={
                  selectedCategory === "all"
                    ? {
                        backgroundColor: colors.green,
                        fontFamily: "var(--font-montserrat)",
                      }
                    : {
                        borderColor: colors.gold,
                        color: colors.green,
                        fontFamily: "var(--font-montserrat)",
                      }
                }
              >
                All Products
              </button>

              {/* Main Category Dropdowns */}
              {mainCategories.map((mainCategory) => {
                const subcategories = dynamicCategoryStructure[mainCategory] || [];
                const isOpen = openDropdown === mainCategory;
                const hasSelectedSubcategory = selectedCategory.startsWith(
                  mainCategory + " - "
                );

                return (
                  <div
                    key={mainCategory}
                    className="relative category-dropdown"
                  >
                    <button
                      onClick={() => toggleDropdown(mainCategory)}
                      className={`px-6 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${
                        hasSelectedSubcategory
                          ? "text-white shadow-lg"
                          : "border-2 hover:bg-slate-50"
                      }`}
                      style={
                        hasSelectedSubcategory
                          ? {
                              backgroundColor: colors.green,
                              fontFamily: "var(--font-montserrat)",
                            }
                          : {
                              borderColor: colors.gold,
                              color: colors.green,
                              fontFamily: "var(--font-montserrat)",
                            }
                      }
                    >
                      {mainCategory}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        className="absolute top-full left-0 mt-2 bg-white border-2 rounded-xl shadow-xl z-50 min-w-[250px] max-h-[400px] overflow-y-auto"
                        style={{ borderColor: colors.gold }}
                      >
                        {subcategories.map((subcategory) => {
                          const fullCategory = `${mainCategory} - ${subcategory}`;
                          const hasProducts =
                            categoriesWithProducts.has(fullCategory);
                          const isSelected = selectedCategory === fullCategory;

                          // Show ALL subcategories, not just ones with products
                          return (
                            <button
                              key={subcategory}
                              onClick={() => hasProducts ? handleCategorySelect(fullCategory) : null}
                              disabled={!hasProducts}
                              className={`w-full text-left px-6 py-3 text-sm font-black uppercase tracking-widest transition-all border-b last:border-b-0 flex items-center justify-between ${
                                isSelected ? "text-white" : hasProducts ? "hover:bg-slate-50" : "opacity-50 cursor-not-allowed"
                              }`}
                              style={
                                isSelected
                                  ? {
                                      backgroundColor: colors.green,
                                      fontFamily: "var(--font-montserrat)",
                                    }
                                  : {
                                      color: colors.green,
                                      fontFamily: "var(--font-montserrat)",
                                      borderColor: colors.goldLight,
                                    }
                              }
                            >
                              <span>{subcategory}</span>
                              {!hasProducts && (
                                <span className="text-xs font-normal ml-2 opacity-75">(No products)</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] bg-slate-200 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p
                className="text-3xl md:text-4xl font-black mb-6"
                style={{ 
                  color: colors.green,
                  fontFamily: "var(--font-montserrat)" 
                }}
              >
                Products Coming Soon
              </p>
              <p 
                className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                We're currently preparing our product catalog. Products will be uploaded soon. 
                Please check back later or contact us for more information.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => {
                const cartQuantity = getCartQuantity(product._id);
                // Extract brand from product name or category
                const brandMatch = product.name.match(/^([A-Z]+)\s/);
                const brand = brandMatch ? brandMatch[1] : product.category?.split(" - ")[0]?.split(" ")[0] || "";
                // Extract size from additionalInfo if available
                const sizeMatch = product.additionalInfo?.match(/Size[:\s]+([^\n]+)/i);
                const size = sizeMatch ? sizeMatch[1].trim() : "";
                // Determine price unit
                const priceUnit = product.category?.includes("Flooring") || product.category?.includes("Vinyl") || product.category?.includes("Laminate") ? "sqft" : "piece";
                
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                      <Link href={`/product/${product._id}`}>
                        <Image
                          src={product.image?.[0] || "/placeholder.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>
                      
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="px-6 py-3 bg-white text-sm font-black uppercase tracking-widest rounded-lg transition-all hover:scale-105"
                          style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}
                        >
                          <Eye className="w-4 h-4 inline mr-2" />
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 space-y-3">
                      {/* Brand */}
                      {brand && (
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                          {brand}
                        </p>
                      )}
                      
                      {/* Product Name */}
                      <Link href={`/product/${product._id}`}>
                        <h3
                          className="text-base font-black leading-tight hover:opacity-70 transition-opacity line-clamp-2"
                          style={{
                            color: colors.green,
                            fontFamily: "var(--font-montserrat)",
                          }}
                        >
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div>
                        {product.offerPrice === 0 || product.price === 0 ? (
                          <Link
                            href="/#contact"
                            className="inline-block px-3 py-1.5 text-xs font-semibold rounded transition-colors hover:opacity-90"
                            style={{
                              backgroundColor: colors.green,
                              color: colors.white,
                              fontFamily: "var(--font-montserrat)",
                            }}
                          >
                            Contact for Pricing
                          </Link>
                        ) : (
                          <p
                            className="text-lg font-black"
                            style={{
                              color: colors.gold,
                              fontFamily: "var(--font-montserrat)",
                            }}
                          >
                            {currency}{product.offerPrice?.toLocaleString()} / {priceUnit}
                          </p>
                        )}
                      </div>

                      {/* Size */}
                      {size && (
                        <p className="text-xs font-bold text-slate-600" style={{ fontFamily: "var(--font-montserrat)" }}>
                          Size: {size}
                        </p>
                      )}

                      {/* Add to Cart / Quantity Controls */}
                      {cartQuantity > 0 ? (
                        <div
                          className="flex items-center justify-between border-2 rounded-lg p-2"
                          style={{ borderColor: colors.gold }}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(`${product._id}`, cartQuantity - 1)
                            }
                            className="p-1.5 hover:bg-slate-50 rounded transition-colors"
                            style={{ color: colors.green }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span
                            className="text-sm font-black px-2"
                            style={{ color: colors.green }}
                          >
                            {cartQuantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(`${product._id}`, cartQuantity + 1)
                            }
                            className="p-1.5 hover:bg-slate-50 rounded transition-colors"
                            style={{ color: colors.green }}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full py-2.5 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: colors.green,
                            fontFamily: "var(--font-montserrat)",
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src={quickViewProduct.image?.[0] || "/placeholder.jpg"}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-black mb-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                      {quickViewProduct.name}
                    </h2>
                    {quickViewProduct.offerPrice === 0 || quickViewProduct.price === 0 ? (
                      <Link
                        href="/#contact"
                        className="inline-block px-4 py-2 text-sm font-semibold rounded-lg transition-colors hover:opacity-90"
                        style={{
                          backgroundColor: colors.green,
                          color: colors.white,
                          fontFamily: "var(--font-montserrat)",
                        }}
                      >
                        Contact for Pricing
                      </Link>
                    ) : (
                      <p className="text-3xl font-black" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                        {currency}{quickViewProduct.offerPrice?.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
                    style={{ color: colors.green }}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-slate-600 font-bold leading-relaxed">
                  {quickViewProduct.description}
                </p>
                <div className="flex gap-3 pt-4">
                  <Link
                    href={`/product/${quickViewProduct._id}`}
                    className="flex-1 py-3 text-white text-sm font-black uppercase tracking-widest rounded-lg shadow-lg transition-all hover:scale-[1.02] text-center"
                    style={{
                      backgroundColor: colors.green,
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3 border-2 text-sm font-black uppercase tracking-widest rounded-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{
                      borderColor: colors.gold,
                      color: colors.gold,
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
