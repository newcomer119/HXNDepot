"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingCart, Plus, Minus, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

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

  // Define category structure with main categories and subcategories
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

  // Get categories that have products
  const categoriesWithProducts = new Set(
    products.map((p) => p.category).filter(Boolean)
  );

  // Filter main categories to only show those that have products
  const mainCategories = Object.keys(categoryStructure).filter((mainCat) => {
    return categoryStructure[mainCat].some((subCat) => {
      const fullCategory = `${mainCat} - ${subCat}`;
      return categoriesWithProducts.has(fullCategory);
    });
  });

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
                const subcategories = categoryStructure[mainCategory];
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

                          if (!hasProducts) return null;

                          return (
                            <button
                              key={subcategory}
                              onClick={() => handleCategorySelect(fullCategory)}
                              className={`w-full text-left px-6 py-3 text-sm font-black uppercase tracking-widest transition-all border-b last:border-b-0 ${
                                isSelected ? "text-white" : "hover:bg-slate-50"
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
                              {subcategory}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => {
                const cartQuantity = getCartQuantity(product._id);
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <Link href={`/product/${product._id}`}>
                      <div className="aspect-[4/5] relative overflow-hidden rounded-2xl mb-6 shadow-lg">
                        <Image
                          src={product.image?.[0] || "/placeholder.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>

                    <div className="space-y-3">
                      <Link href={`/product/${product._id}`}>
                        <h3
                          className="text-xl font-black mb-1 hover:opacity-70 transition-opacity"
                          style={{
                            color: colors.green,
                            fontFamily: "var(--font-montserrat)",
                          }}
                        >
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between">
                        <div>
                          {product.offerPrice === 0 || product.price === 0 ? (
                            <p
                              className="text-lg font-black"
                              style={{
                                color: colors.green,
                                fontFamily: "var(--font-montserrat)",
                              }}
                            >
                              Contact the store
                            </p>
                          ) : (
                            <>
                              <p
                                className="text-2xl font-black"
                                style={{
                                  color: colors.gold,
                                  fontFamily: "var(--font-montserrat)",
                                }}
                              >
                                {currency}
                                {product.offerPrice}
                              </p>
                              {product.price > product.offerPrice && (
                                <p className="text-sm text-slate-400 line-through">
                                  {currency}
                                  {product.price}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {cartQuantity > 0 ? (
                        <div
                          className="flex items-center justify-between border-2 rounded-xl p-2"
                          style={{ borderColor: colors.gold }}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(`${product._id}`, cartQuantity - 1)
                            }
                            className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                            style={{ color: colors.green }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span
                            className="text-sm font-black"
                            style={{ color: colors.green }}
                          >
                            {cartQuantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(`${product._id}`, cartQuantity + 1)
                            }
                            className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                            style={{ color: colors.green }}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full py-3 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: colors.green,
                            fontFamily: "var(--font-montserrat)",
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      )}

                      <div
                        className="w-8 h-1 transition-all group-hover:w-16"
                        style={{ backgroundColor: colors.gold }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
