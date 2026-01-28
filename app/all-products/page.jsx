"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingCart, Plus, Minus, ChevronDown, Eye, X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const partners = [
  {
    name: "Vidar Design Flooring",
    url: "https://vidarflooring.com",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    description: "Premium engineered hardwood flooring solutions combining exceptional craftsmanship with timeless elegance for both residential and commercial applications."
  },
  {
    name: "Oakel City Canada Ltd.",
    url: "https://oakelcity.com",
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&q=80",
    description: "A leading Canadian supplier of premium flooring solutions, offering an extensive range of high-quality products tailored for modern interior design."
  },
  {
    name: "Canadian Standard",
    url: "https://canadianstandardflooring.com",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    description: "A trusted industry leader in Canadian flooring, setting the standard for quality and innovation in flooring solutions nationwide."
  },
  {
    name: "Evergreen Building Materials Ltd.",
    url: "https://evergreenlbm.com",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80",
    description: "Sustainable building materials and eco-friendly flooring options that seamlessly blend environmental responsibility with superior performance and durability."
  },
  {
    name: "Weiss Flooring",
    url: "https://weisscommercialflooring.com",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
    description: "Specialized commercial flooring experts delivering durable, stylish solutions engineered for high-traffic environments and demanding applications."
  },
  {
    name: "Woden Flooring",
    url: "https://wodenflooring.com",
    image: "https://images.unsplash.com/photo-1600607688908-df9c8040b7e0?w=800&q=80",
    description: "Master craftsmen specializing in premium hardwood flooring, creating beautiful and enduring solutions for the most discerning clientele."
  },
  {
    name: "Tosca Floors",
    url: "https://tosca-floors.com",
    image: "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&q=80",
    description: "European-inspired flooring designs that harmoniously blend classic elegance with contemporary functionality for sophisticated interior spaces."
  },
  {
    name: "Golden Choice Flooring Inc.",
    url: "https://goldenchoiceflooring.ca",
    image: "https://images.unsplash.com/photo-1600607689042-6a1c0a54d0a3?w=800&q=80",
    description: "Your premier choice for premium flooring solutions, delivering exceptional value and uncompromising quality across a comprehensive product portfolio."
  },
  {
    name: "Toucan Quality Flooring",
    url: "https://toucanflooring.com",
    image: "https://images.unsplash.com/photo-1600607688270-0b5b0b5b5b5b?w=800&q=80",
    description: "Quality-driven flooring specialists dedicated to providing superior products and exceptional customer service with every project."
  },
  {
    name: "Pangol Flooring Inc.",
    url: "https://pangolflooring.com",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    description: "Innovative flooring solutions featuring avant-garde designs and premium materials, perfect for contemporary and modern architectural spaces."
  }
];

export default function ProductsPage() {
  const { products, isLoading, addToCart, currency } = useAppContext();
  const { updateQuantity, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingAllProducts, setIsLoadingAllProducts] = useState(true);
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(1);

  // Calculate cards per slide based on screen size
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1280) {
        setCardsPerSlide(4);
      } else if (window.innerWidth >= 1024) {
        setCardsPerSlide(3);
      } else if (window.innerWidth >= 768) {
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(1);
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

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

  // Scroll to products section on mount or when hash is present
  useEffect(() => {
    const scrollToProducts = () => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        const offset = 100; // Offset for navbar
        const elementPosition = productsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    // Check if there's a hash in the URL
    if (window.location.hash === '#products') {
      // Small delay to ensure page is fully rendered
      setTimeout(scrollToProducts, 500);
    } else if (window.location.hash && window.location.hash !== '#products') {
      // Handle other hash links
      setTimeout(() => {
        const element = document.querySelector(window.location.hash);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
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

  // Filter products - use allProducts if available, otherwise fallback to products
  const productsToFilter = allProducts.length > 0 ? allProducts : products;
  const filteredProducts = productsToFilter.filter((product) => {
    let matchesCategory = selectedCategory === "all";
    
    if (!matchesCategory && product.category) {
      // Support both exact match and main category match
      if (selectedCategory.includes(" - ")) {
        // Exact match for full category (e.g., "Electronics - Headphones")
        matchesCategory = product.category === selectedCategory;
      } else {
        // Main category match (e.g., "Electronics" matches "Electronics - Headphones")
        matchesCategory = product.category.startsWith(selectedCategory + " - ") || 
                        product.category === selectedCategory;
      }
    }
    
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
        </div>
      </section>

      {/* Partner Stores Section */}
      <section className="relative py-24 bg-gradient-to-b from-white via-slate-50/30 to-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: colors.gold }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: colors.green }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px" style={{ backgroundColor: colors.gold }} />
              <span
                className="text-xs font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full border-2"
                style={{ 
                  color: colors.gold,
                  borderColor: colors.gold,
                  fontFamily: "var(--font-montserrat)",
                  backgroundColor: `${colors.goldLight}20`
                }}
              >
                Trusted Partners
              </span>
              <div className="w-12 h-px" style={{ backgroundColor: colors.gold }} />
            </div>
            <h2
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              style={{ 
                color: colors.green,
                fontFamily: "var(--font-montserrat)" 
              }}
            >
              Our Trusted Flooring Partners
            </h2>
            <p 
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-6 leading-relaxed"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              We collaborate with industry-leading flooring manufacturers and suppliers to bring you premium quality products and exceptional service.
            </p>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: colors.gold }} />
          </motion.div>

          {/* Partners Slider */}
          <div className="relative mb-20">
            {/* Navigation Controls */}
            <div className="flex items-center justify-between mb-6">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from({ length: Math.ceil(partners.length / cardsPerSlide) }).map((_, slideIndex) => {
                  const isActive = Math.floor(currentPartnerIndex / cardsPerSlide) === slideIndex;
                  return (
                    <button
                      key={slideIndex}
                      onClick={() => {
                        setCurrentPartnerIndex(slideIndex * cardsPerSlide);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isActive ? 'w-8' : 'w-2'
                      }`}
                      style={{
                        backgroundColor: isActive ? colors.gold : colors.goldLight,
                        opacity: isActive ? 1 : 0.5
                      }}
                      aria-label={`Go to slide ${slideIndex + 1}`}
                    />
                  );
                })}
              </div>
              
              {/* Navigation Arrows */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const newIndex = Math.max(0, currentPartnerIndex - cardsPerSlide);
                    setCurrentPartnerIndex(newIndex);
                  }}
                  disabled={currentPartnerIndex === 0}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    currentPartnerIndex > 0
                      ? 'hover:scale-110 hover:shadow-lg cursor-pointer' 
                      : 'opacity-30 cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: colors.green,
                    color: colors.white
                  }}
                  aria-label="Previous partners"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const maxIndex = Math.max(0, partners.length - cardsPerSlide);
                    const newIndex = Math.min(maxIndex, currentPartnerIndex + cardsPerSlide);
                    setCurrentPartnerIndex(newIndex);
                  }}
                  disabled={currentPartnerIndex >= partners.length - cardsPerSlide}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    currentPartnerIndex < partners.length - cardsPerSlide
                      ? 'hover:scale-110 hover:shadow-lg cursor-pointer' 
                      : 'opacity-30 cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: colors.green,
                    color: colors.white
                  }}
                  aria-label="Next partners"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slider Container */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-6 md:gap-8"
                animate={{
                  x: `-${(currentPartnerIndex / cardsPerSlide) * 100}%`
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                {partners.map((partner, index) => (
                  <motion.a
                    key={partner.name}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 hover:border-transparent flex-shrink-0"
                    style={{
                      width: `${100 / cardsPerSlide}%`,
                      boxShadow: "0 4px 20px -4px rgba(0, 0, 0, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.06)"
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Partner Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div 
                        className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg"
                        style={{ 
                          backgroundColor: colors.gold,
                          color: colors.white,
                          fontFamily: "var(--font-montserrat)"
                        }}
                      >
                        Partner
                      </div>
                    </div>

                    {/* Decorative Corner */}
                    <div 
                      className="absolute top-0 left-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${colors.gold} 0%, transparent 70%)`
                      }}
                    />

                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      <Image
                        src={partner.image}
                        alt={partner.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      
                      {/* Shine Effect on Hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>

                    <div className="p-6 relative">
                      <div className="mb-4">
                        <h3
                          className="text-lg md:text-xl font-black mb-2.5 group-hover:scale-105 transition-transform inline-block leading-tight"
                          style={{ 
                            color: colors.green,
                            fontFamily: "var(--font-montserrat)" 
                          }}
                        >
                          {partner.name}
                        </h3>
                        <div className="w-14 h-0.5 rounded-full mb-3" style={{ backgroundColor: colors.gold }} />
                      </div>
                      
                      <p className="text-slate-600 mb-6 leading-relaxed text-xs md:text-sm line-clamp-3 min-h-[3.5rem]" style={{ fontFamily: "var(--font-montserrat)" }}>
                        {partner.description}
                      </p>
                      
                      <div 
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all duration-300 group-hover:gap-3 group-hover:shadow-lg group-hover:scale-105"
                        style={{ 
                          color: colors.white,
                          backgroundColor: colors.green,
                          fontFamily: "var(--font-montserrat)"
                        }}
                      >
                        <span>Visit Website</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        boxShadow: `0 0 0 2px ${colors.gold}40, 0 0 30px ${colors.gold}20`
                      }}
                    />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="relative py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p
              className="text-lg md:text-xl font-bold leading-relaxed max-w-3xl mx-auto mb-4"
              style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}
            >
              Through strategic partnerships with industry leaders, we ensure access to the finest flooring products, expert guidance, and comprehensive solutions for every project requirement.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-8 h-px" style={{ backgroundColor: colors.gold }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.gold }} />
              <div className="w-8 h-px" style={{ backgroundColor: colors.gold }} />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="products-section" className="py-12 bg-white border-y border-slate-100 scroll-mt-24">
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

      {/* Products Section */}
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
