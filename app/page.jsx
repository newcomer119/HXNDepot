"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Menu, X, CheckCircle, Store, TrendingUp, Eye, Users, Zap, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SellerRegistrationModal from "@/components/SellerRegistrationModal";
import ContactSection from "@/app/contact/ContactSection";

const stats = [
  { number: "15+", label: "Years of Excellence", subtitle: "Industry Experience" },
  { number: "250+", label: "Curated Designs", subtitle: "World-Class Collections" },
  { number: "10,000+", label: "Tiles Manufactured" },
  { number: "100,000+", label: "Dreams Delivered" },
];

const products = [
  {
    title: "Porcelain Tiles",
    description: "Premium porcelain with marble-inspired veining",
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&q=80",
  },
  {
    title: "Bathroom Vanities",
    description: "Modern vanities with elegant countertops",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
  },
  {
    title: "Floor Tiles",
    description: "Durable flooring for every space",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  },
  {
    title: "Wall Tiles",
    description: "Transform walls into art",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80",
  },
];

// Custom colors based on the image
const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

// Animated number component
function AnimatedNumber({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Parse the number (handle "15+", "250+", "10,000+", "100,000+")
          const numStr = value.replace(/,/g, '').replace('+', '');
          const target = parseInt(numStr, 10);
          
          const startTime = Date.now();
          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            setCount(current);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, duration, hasAnimated]);

  // Format number with commas and add "+" if original had it
  const formatNumber = (num) => {
    const formatted = num.toLocaleString();
    return value.includes('+') ? `${formatted}+` : formatted;
  };

  return (
    <span ref={ref}>{formatNumber(count)}</span>
  );
}

const categories = [
  {
    title: "Premium Tiles",
    description: "Porcelain & Mosaic collections for every space",
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=2400&q=100&auto=format&fit=crop",
    link: "/all-products?category=Tiles",
    linkText: "Explore Tiles"
  },
  {
    title: "Luxury Flooring",
    description: "Hardwood, Vinyl & Laminate solutions",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2400&q=100&auto=format&fit=crop",
    link: "/all-products?category=Floorings",
    linkText: "Explore Flooring"
  },
  {
    title: "Kitchen Systems",
    description: "Cabinets, Countertops & Complete Solutions",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=2400&q=100&auto=format&fit=crop",
    link: "/all-products?category=Kitchens",
    linkText: "Explore Kitchens"
  },
  {
    title: "Bathroom Products",
    description: "Vanities, Faucets & Complete Bathroom Solutions",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=2400&q=100&auto=format&fit=crop",
    link: "/all-products?category=Bathroom Products",
    linkText: "View Collection"
  }
];

export default function Home() {
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality for background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categories.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />
      <SellerRegistrationModal 
        isOpen={isSellerModalOpen} 
        onClose={() => setIsSellerModalOpen(false)} 
      />

      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-100/20 via-white/70 to-white/85 opacity-50 z-10" />
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: currentSlide === index ? 0.5 : 0,
                scale: currentSlide === index ? 1 : 1.05
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover grayscale-[0.15]"
                priority={index === 0}
                quality={100}
                sizes="100vw"
              />
            </motion.div>
          ))}
        </div>

        {/* Text Content Overlay */}
        <div className="relative max-w-7xl mx-auto px-6 py-32 w-full z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-black tracking-[0.3em] mb-6 uppercase" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              Luxury Reimagined
            </p>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] mb-8" style={{ fontFamily: "var(--font-montserrat)" }}>
              <span className="block" style={{ color: colors.gold }}>PREMIUM</span>
              <span className="block" style={{ color: colors.green }}>SURFACES</span>
            </h1>
            <p className="text-2xl md:text-3xl font-black mb-8 tracking-wide" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              Bathrooms • Flooring • Tiles • Kitchens • Countertops • Lighting
            </p>

            <div className="w-24 h-1.5 mb-8" style={{ backgroundColor: colors.gold }} />

            <p className="text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-bold" style={{ color: colors.green }}>
              Elevate your architectural vision with our world-class porcelain collections and bespoke bathroom fixtures.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/all-products"
                className="inline-flex items-center gap-3 text-white px-10 py-5 text-base font-black transition-all duration-300 group rounded shadow-xl hover:translate-y-[-2px]"
                style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
              >
                Explore Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-3 border-2 px-10 py-5 text-base font-black transition-all duration-300 rounded shadow-md hover:bg-slate-50"
                style={{ borderColor: colors.gold, color: colors.gold, fontFamily: "var(--font-montserrat)" }}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>

          {/* Slider Dots Navigation */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-black mb-2" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                  <AnimatedNumber value={stat.number} duration={2000} />
                </div>
                <div className="text-sm tracking-[0.2em] font-black uppercase mb-1" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                  {stat.label}
                </div>
                {stat.subtitle && (
                  <div className="text-xs tracking-[0.1em] font-bold uppercase opacity-70" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                    {stat.subtitle}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80"
                  alt="Luxury Showroom"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-black tracking-[0.4em] uppercase mb-4 block" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
              </span>
              <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
                Crafting <span style={{ color: colors.green }}>Elegance</span> In Every <span style={{ color: colors.gold }}>Surface</span>
              </h2>
              <p className="text-lg leading-relaxed mb-8 font-bold" style={{ color: colors.green }}>
              HXN Building Depot stands at the forefront of architectural surfaces. We curate the finest flooring, tiles, & Bathroom fixtures.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 text-white px-10 py-5 text-base font-black transition-all duration-300 group rounded shadow-xl"
                style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
              >
                Our Legacy
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="products" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-sm font-black tracking-[0.4em] uppercase mb-4 block" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                Collections
              </span>
              <h2 className="text-5xl md:text-6xl font-black leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
                Refined <span style={{ color: colors.green }}>Selection</span>
              </h2>
            </div>
            <Link href="/all-products" className="font-black text-sm tracking-widest uppercase pb-2 border-b-2 transition-all hover:opacity-70" style={{ borderColor: colors.gold, color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
              View All Products
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="aspect-[4/5] relative overflow-hidden rounded-2xl mb-6 shadow-lg">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-bold mb-2">{product.description}</p>
                    <Link href="/all-products" className="block w-full py-3 bg-white text-center text-xs font-black uppercase tracking-widest rounded-lg" style={{ color: colors.green }}>
                      View Detail
                    </Link>
                  </div>
                </div>
                <h3 className="text-xl font-black mb-1" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>{product.title}</h3>
                <div className="w-8 h-1 transition-all group-hover:w-16" style={{ backgroundColor: colors.gold }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="sellers" className="py-32 bg-gradient-to-b from-white to-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-black tracking-[0.4em] uppercase mb-4 block" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
              For Sellers
            </span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
              Join Our <span style={{ color: colors.green }}>Platform</span> & <span style={{ color: colors.gold }}>Grow</span> Your Business
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-bold" style={{ color: colors.green }}>
              Connect with thousands of customers looking for premium real estate products. List your tiles, bathroom fixtures, and more on our trusted marketplace.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
                  alt="Seller Dashboard"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="w-6 h-6" style={{ color: colors.gold }} />
                      <h3 className="text-xl font-black" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                        TilesView Support
                      </h3>
                    </div>
                    <p className="text-sm font-bold" style={{ color: colors.green }}>
                      Visualize your products in real rooms. Customers can see exactly how your tiles and fixtures will look in their space before purchasing.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: colors.goldLight }}>
                    <Users className="w-6 h-6" style={{ color: colors.green }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                      Reach More Customers
                    </h3>
                    <p className="text-base leading-relaxed font-bold" style={{ color: colors.green }}>
                      Access a growing community of homeowners, contractors, and designers actively searching for quality products.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: colors.goldLight }}>
                    <TrendingUp className="w-6 h-6" style={{ color: colors.green }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                      Boost Your Sales
                    </h3>
                    <p className="text-base leading-relaxed font-bold" style={{ color: colors.green }}>
                      Increase visibility and sales with our optimized platform designed to showcase your products to the right audience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: colors.goldLight }}>
                    <Zap className="w-6 h-6" style={{ color: colors.green }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                      Easy Management
                    </h3>
                    <p className="text-base leading-relaxed font-bold" style={{ color: colors.green }}>
                      Simple dashboard to manage your inventory, track orders, and update product listings with ease.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-white rounded-3xl p-12 border-2 shadow-xl" style={{ borderColor: colors.gold }}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
                  Why Choose <span style={{ color: colors.green }}>HXN Building Depot</span>?
                </h3>
                <div className="space-y-4">
                  {[
                    "Zero setup fees - Start selling immediately",
                    "TilesView AR visualization for better customer engagement",
                    "Dedicated seller support team",
                    "Secure payment processing",
                    "Real-time inventory management",
                    "Marketing tools to promote your products"
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: colors.gold }} />
                      <span className="text-base font-bold" style={{ color: colors.green }}>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-8 rounded-2xl mb-6" style={{ backgroundColor: colors.goldLight }}>
                  <Store className="w-16 h-16 mx-auto mb-4" style={{ color: colors.green }} />
                </div>
                <p className="text-lg font-bold mb-8" style={{ color: colors.green }}>
                  Ready to expand your reach and grow your business?
                </p>
                <button
                  onClick={() => setIsSellerModalOpen(true)}
                  className="inline-flex items-center gap-3 text-white px-10 py-5 text-base font-black transition-all duration-300 group rounded shadow-xl hover:translate-y-[-2px]"
                  style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
                >
                  Become a Seller
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />

      {/* Floating Get Quote Button */}
      <a
        href="mailto:info@hxnbuildingdepot.ca?subject=Quote Request"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center gap-2 px-3 py-6 rounded-l-xl shadow-xl transition-all duration-300 hover:translate-x-[-3px] group cursor-pointer border-l-2 border-t-2 border-b-2"
        style={{ 
          backgroundColor: colors.green,
          borderColor: colors.gold
        }}
        aria-label="Get Quote"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.gold }}>
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: colors.green }} />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span 
            className="font-black text-[10px] tracking-wider uppercase leading-tight" 
            style={{ 
              fontFamily: "var(--font-montserrat)", 
              color: colors.white,
              letterSpacing: '0.1em'
            }}
          >
            Get
          </span>
          <span 
            className="font-black text-[10px] tracking-wider uppercase leading-tight" 
            style={{ 
              fontFamily: "var(--font-montserrat)", 
              color: colors.gold,
              letterSpacing: '0.1em'
            }}
          >
            Quote
          </span>
        </div>
      </a>

      <Footer />
    </div>
  );
}
