"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingCart, Plus, Minus } from "lucide-react";
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

  // Define all available categories
  const allCategories = [
    "all",
    "Bathroom Products - Toilets",
    "Bathroom Products - Floating Vanities",
    "Bathroom Products - Free Standing Vanities",
    "Bathroom Products - Plain & LED Mirrors",
    "Bathroom Products - Faucets",
    "Bathroom Products - Towel Bar Sets",
    "Bathroom Products - Free Standing Tubs",
    "Bathroom Products - Tub Faucets",
    "Bathroom Products - Shower Glass",
    "Bathroom Products - Shower Drains",
    "Bathroom Products - Shower Faucets",
    "Bathroom Products - Tile Edges",
    "Floorings - Solid/HardWood Floorings",
    "Floorings - Engineering Wood Floorings",
    "Floorings - Vinyl Floorings",
    "Floorings - Laminate Floorings",
    "Tiles - Porcelain Tiles",
    "Tiles - Mosaic Tiles",
    "Kitchens - Melamine Cabinets",
    "Kitchens - MDF Laminates Cabinets",
    "Kitchens - MDF Painted Cabinets",
    "Kitchens - Solid Wood Painted Cabinets",
    "Countertops - Quartz Countertop",
    "Countertops - Granite Countertop",
    "Countertops - Porcelain Countertop",
    "Lightning - Potlights",
    "Lightning - Chandeliers",
    "Lightning - Lamps",
    "Lightning - Vanity Lights",
    "Lightning - LED Mirrors",
    "Lightning - Island Lights"
  ];
  
  // Get categories that have products
  const categoriesWithProducts = new Set(products.map(p => p.category).filter(Boolean));
  const categories = allCategories.filter(cat => cat === "all" || categoriesWithProducts.has(cat));

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    addToCart(product._id);
    toast.success("Item added to cart");
  };

  const getCartQuantity = (productId) => {
    const cartItem = cart.find(item => item.productId === productId);
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
            <span className="text-sm font-black tracking-[0.4em] uppercase mb-4 block" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
              Our Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
              <span style={{ color: colors.green }}>Premium </span>
              <span style={{ color: colors.gold }}>Products</span>
            </h1>
            <p className="text-lg md:text-xl font-bold leading-relaxed" style={{ color: colors.green }}>
              Discover our curated selection of premium tiles and bathroom fixtures.
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
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${
                    selectedCategory === category
                      ? "text-white shadow-lg"
                      : "border-2 hover:bg-slate-50"
                  }`}
                  style={
                    selectedCategory === category
                      ? { backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }
                      : { borderColor: colors.gold, color: colors.green, fontFamily: "var(--font-montserrat)" }
                  }
                >
                  {category === "all" ? "All Products" : category.split(" - ")[1] || category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-black text-slate-400 mb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
                No products found
              </p>
              <p className="text-slate-500">Try adjusting your search or category filter.</p>
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
                        <h3 className="text-xl font-black mb-1 hover:opacity-70 transition-opacity" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                          {product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-black" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                            {currency}{product.offerPrice}
                          </p>
                          {product.price > product.offerPrice && (
                            <p className="text-sm text-slate-400 line-through">
                              {currency}{product.price}
                            </p>
                          )}
                        </div>
                      </div>

                      {cartQuantity > 0 ? (
                        <div className="flex items-center justify-between border-2 rounded-xl p-2" style={{ borderColor: colors.gold }}>
                          <button
                            onClick={() => updateQuantity(`${product._id}`, cartQuantity - 1)}
                            className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                            style={{ color: colors.green }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-black" style={{ color: colors.green }}>{cartQuantity}</span>
                          <button
                            onClick={() => updateQuantity(`${product._id}`, cartQuantity + 1)}
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
                          style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      )}
                      
                      <div className="w-8 h-1 transition-all group-hover:w-16" style={{ backgroundColor: colors.gold }} />
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
