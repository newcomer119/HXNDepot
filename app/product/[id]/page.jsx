"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, ArrowLeft, ZoomIn, Check, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import Link from "next/link";
import TilesViewModal from "@/components/TilesViewModal";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

export default function Product() {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart, user, currency, setIsLoading } = useAppContext();
  const { cart, updateQuantity, cartCount } = useCart();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedColorImage, setSelectedColorImage] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showTilesView, setShowTilesView] = useState(false);

  const fetchProductData = async () => {
    setIsProductLoading(true);
    const product = products.find((product) => product._id === id);
    setProductData(product);
    if (product) {
      setMainImage(product.image?.[0] || null);
      if (product.colors) {
        if (Array.isArray(product.colors) && product.colors.length > 0) {
          setSelectedColor(product.colors[0]);
          setSelectedColorImage(product.colorImages ? product.colorImages[product.colors[0]] : null);
        } else if (typeof product.colors === 'string') {
          const firstColor = product.colors.split(/(?=[A-Z])/)[0];
          setSelectedColor(firstColor);
          setSelectedColorImage(product.colorImages ? product.colorImages[firstColor] : null);
        }
      }
    }
    setIsProductLoading(false);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products.length]);

  useEffect(() => {
    if (!isProductLoading) {
      setIsLoading(false);
    }
  }, [isProductLoading, setIsLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [setIsLoading]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedColorImage(productData.colorImages ? productData.colorImages[color] : null);
  };

  const getCartQuantity = () => {
    if (!productData) return 0;
    const cartKey = selectedColor ? `${productData._id}_${selectedColor}` : productData._id;
    const cartItem = cart.find(item => item.id === cartKey);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login first to add items to cart");
      router.push('/');
      return;
    }
    
    const hasMultipleColors = productData.colors && (
      (Array.isArray(productData.colors) && productData.colors.length > 1) ||
      (typeof productData.colors === 'string' && productData.colors.split(/(?=[A-Z])/).length > 1)
    );
    
    if (hasMultipleColors && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    
    addToCart(productData._id, selectedColor, selectedColorImage);
    toast.success("Item added to cart");
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login first to buy products");
      router.push('/');
      return;
    }
    
    const hasMultipleColors = productData.colors && (
      (Array.isArray(productData.colors) && productData.colors.length > 1) ||
      (typeof productData.colors === 'string' && productData.colors.split(/(?=[A-Z])/).length > 1)
    );
    
    if (hasMultipleColors && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    
    const cartKey = selectedColor ? `${productData._id}_${selectedColor}` : productData._id;
    const cartItem = cart.find(item => item.id === cartKey);
    
    if (!cartItem) {
      addToCart(productData._id, selectedColor, selectedColorImage);
    }
    router.push("/cart");
  };

  if (isProductLoading) {
    return <Loading />;
  }

  if (!productData) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 pt-32">
          <h1 className="text-3xl font-black mb-4" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
            Product Not Found
          </h1>
          <p className="text-slate-600 mb-8 font-bold">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/all-products"
            className="px-10 py-4 text-white text-base font-black uppercase tracking-widest rounded-xl shadow-lg transition-all hover:scale-105"
            style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
          >
            Browse All Products
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const cartQuantity = getCartQuantity();
  const hasMultipleColors = productData.colors && (
    (Array.isArray(productData.colors) && productData.colors.length > 1) ||
    (typeof productData.colors === 'string' && productData.colors.split(/(?=[A-Z])/).length > 1)
  );
  const colorsArray = Array.isArray(productData.colors) 
    ? productData.colors 
    : (productData.colors ? productData.colors.split(/(?=[A-Z])/) : []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Zoom Modal */}
      {zoomedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-7xl mx-auto px-6" onClick={e => e.stopPropagation()}>
            <Image
              src={zoomedImage}
              alt="Zoomed"
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            />
            <button
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-slate-800 hover:bg-white transition-colors"
              onClick={() => setZoomedImage(null)}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-8 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Back</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div 
                className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 shadow-2xl cursor-zoom-in group"
                onClick={() => setZoomedImage(mainImage || productData.image?.[0])}
              >
                <Image
                  src={mainImage || productData.image?.[0] || "/placeholder.jpg"}
                  alt={productData.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {productData.image && productData.image.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {productData.image.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(image)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        mainImage === image || (!mainImage && index === 0)
                          ? 'border-slate-900 scale-105'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${productData.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Category Badge */}
              <div>
                <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                  {productData.category?.split(" - ")[0] || "Product"}
                </span>
                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
                  {productData.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className="text-xl" style={{ color: index < 4 ? colors.gold : "#e5e7eb" }}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-slate-600 font-bold">(4.5)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                {productData.offerPrice === 0 || productData.price === 0 ? (
                  <span className="text-3xl font-black" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                    Contact the store
                  </span>
                ) : (
                  <>
                    <span className="text-5xl font-black" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                      {currency}{productData.offerPrice?.toLocaleString()}
                    </span>
                    {productData.price > productData.offerPrice && (
                      <span className="text-2xl text-slate-400 line-through font-bold">
                        {currency}{productData.price?.toLocaleString()}
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="w-24 h-1" style={{ backgroundColor: colors.gold }} />

              {/* Description */}
              <div className="space-y-4">
                <p className="text-lg text-slate-700 font-bold leading-relaxed">
                  {productData.description}
                </p>
                {productData.additionalInfo && (
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                      Additional Information
                    </h3>
                    <div className="text-slate-700 font-bold space-y-2">
                      {productData.additionalInfo.split('\n').map((info, idx) => (
                        <p key={idx}>{info}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Color Selection */}
              {hasMultipleColors && (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                    Select Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {colorsArray.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                          selectedColor === color
                            ? 'text-white shadow-lg scale-105'
                            : 'border-2 text-slate-700 hover:scale-105'
                        }`}
                        style={
                          selectedColor === color
                            ? { backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }
                            : { borderColor: colors.gold, fontFamily: "var(--font-montserrat)" }
                        }
                      >
                        {productData.colorImages && productData.colorImages[color] && (
                          <img
                            src={productData.colorImages[color]}
                            alt={color}
                            className="w-8 h-8 rounded-full border-2 border-white"
                          />
                        )}
                        {color}
                        {selectedColor === color && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                  {selectedColorImage && (
                    <div className="mt-4">
                      <img
                        src={selectedColorImage}
                        alt={selectedColor}
                        className="w-32 h-32 object-cover rounded-xl border-2 shadow-lg cursor-zoom-in"
                        style={{ borderColor: colors.gold }}
                        onClick={() => setZoomedImage(selectedColorImage)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Product Details Table */}
              <div className="border-t border-slate-200 pt-6">
                <table className="w-full">
                  <tbody className="space-y-4">
                    <tr>
                      <td className="text-sm font-black uppercase tracking-widest text-slate-500 py-2" style={{ fontFamily: "var(--font-montserrat)" }}>
                        Category
                      </td>
                      <td className="text-right font-bold text-slate-700">
                        {productData.category}
                      </td>
                    </tr>
                    {productData.colors && (
                      <tr>
                        <td className="text-sm font-black uppercase tracking-widest text-slate-500 py-2" style={{ fontFamily: "var(--font-montserrat)" }}>
                          Colors Available
                        </td>
                        <td className="text-right font-bold text-slate-700">
                          {colorsArray.length > 1 ? `${colorsArray.length} options` : colorsArray[0] || "Standard"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* View in Your Room Button */}
              <div className="pt-4">
                <button
                  onClick={() => setShowTilesView(true)}
                  className="w-full py-4 border-2 text-base font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  style={{ borderColor: colors.gold, color: colors.gold, fontFamily: "var(--font-montserrat)" }}
                >
                  <Home className="w-5 h-5" />
                  View in Your Room
                </button>
              </div>

              {/* Add to Cart / Buy Now */}
              <div className="space-y-4 pt-6">
                {cartQuantity > 0 ? (
                  <div className="flex items-center justify-between border-2 rounded-xl p-4" style={{ borderColor: colors.gold }}>
                    <span className="text-sm font-black uppercase tracking-widest" style={{ color: colors.green }}>
                      In Cart: {cartQuantity}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(selectedColor ? `${productData._id}_${selectedColor}` : productData._id, cartQuantity - 1)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                        style={{ color: colors.green }}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-xl font-black w-12 text-center" style={{ color: colors.green }}>
                        {cartQuantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(selectedColor ? `${productData._id}_${selectedColor}` : productData._id, cartQuantity + 1)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                        style={{ color: colors.green }}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-5 text-white text-base font-black uppercase tracking-widest rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                      style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 py-5 border-2 text-base font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ borderColor: colors.gold, color: colors.gold, fontFamily: "var(--font-montserrat)" }}
                    >
                      Buy Now
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          <section className="mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-sm font-black tracking-[0.4em] uppercase mb-4 block" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                  Explore More
                </span>
                <h2 className="text-4xl md:text-5xl font-black leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
                  Related <span style={{ color: colors.green }}>Products</span>
                </h2>
              </div>
              <Link
                href="/all-products"
                className="font-black text-sm tracking-widest uppercase pb-2 border-b-2 transition-all hover:opacity-70 mt-4 md:mt-0"
                style={{ borderColor: colors.gold, color: colors.gold, fontFamily: "var(--font-montserrat)" }}
              >
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products
                .filter(product => product._id !== id)
                .slice(0, 4)
                .map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden rounded-2xl mb-4 shadow-lg">
                      <Image
                        src={product.image?.[0] || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-lg font-black mb-2 hover:opacity-70 transition-opacity" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                      {product.name}
                    </h3>
                    {product.offerPrice === 0 || product.price === 0 ? (
                      <p className="text-base font-black mb-4" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                        Contact the store
                      </p>
                    ) : (
                      <p className="text-xl font-black mb-4" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                        {currency}{product.offerPrice?.toLocaleString()}
                      </p>
                    )}
                    <div className="w-8 h-1 transition-all group-hover:w-16" style={{ backgroundColor: colors.gold }} />
                  </motion.div>
                ))}
            </div>
          </section>
        </div>
      </div>

      {/* TilesView Modal */}
      <TilesViewModal isOpen={showTilesView} onClose={() => setShowTilesView(false)} />

      <Footer />
    </div>
  );
}
