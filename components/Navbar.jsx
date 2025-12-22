"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/all-products" },
  { name: "Collections", href: "/#products" },
  { name: "Contact Us", href: "/#contact" },
];

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, cartCount, totalAmount } = useCart();
  const { isSeller } = useAppContext();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex flex-col items-start leading-none group">
            <div className="flex items-center gap-2">
              <span 
                className="text-xl md:text-2xl font-black tracking-tighter"
                style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}
              >
                HXN BUILDING DEPOT
              </span>
            </div>
            <span 
              className="text-[10px] md:text-xs italic font-bold tracking-[0.2em] mt-1"
              style={{ color: colors.green, fontFamily: "var(--font-inter)" }}
            >
              Materials & Constructions
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-black transition-all flex items-center gap-1 hover:opacity-70 relative py-1"
                style={{ 
                  color: isActiveLink(link.href) ? colors.gold : colors.green,
                  fontFamily: "var(--font-montserrat)"
                }}
              >
                {link.name}
                {isActiveLink(link.href) && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: colors.gold }}
                  />
                )}
              </Link>
            ))}
            {isSeller && (
              <Link
                href="/seller"
                className="text-sm font-black transition-all hover:opacity-70"
                style={{ 
                  color: colors.green,
                  fontFamily: "var(--font-montserrat)"
                }}
              >
                Seller Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2 group"
              style={{ color: colors.green }}
            >
              <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span 
                  className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full text-white"
                  style={{ backgroundColor: colors.gold }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <UserButton />
            ) : (
              <button
                onClick={openSignIn}
                className="text-sm font-black transition-all hover:opacity-70"
                style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}
              >
                Account
              </button>
            )}

            <div className="hidden lg:block">
              <Link
                href="/#contact"
                className="px-6 py-3 text-white text-xs font-black uppercase tracking-widest transition-all duration-300 rounded shadow-lg hover:scale-105 active:scale-95"
                style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
              >
                Project Enquiry
              </Link>
            </div>

            <button
              className="lg:hidden p-2"
              style={{ color: colors.green }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-t border-slate-100 py-6 px-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-3 font-black text-sm uppercase tracking-widest"
                style={{ 
                  color: isActiveLink(link.href) ? colors.gold : colors.green,
                  fontFamily: "var(--font-montserrat)"
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isSeller && (
              <Link
                href="/seller"
                className="block py-3 font-black text-sm uppercase tracking-widest"
                style={{ 
                  color: colors.green,
                  fontFamily: "var(--font-montserrat)"
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Seller Dashboard
              </Link>
            )}
            <Link
              href="/#contact"
              className="mt-4 block px-6 py-3 text-white text-xs font-black text-center uppercase tracking-widest rounded shadow-md"
              style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Project Enquiry
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col h-full"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-black" style={{ color: colors.green }}>Your Cart</h2>
                <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-slate-50 rounded-full">
                  <X className="w-6 h-6" style={{ color: colors.green }} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.goldLight }}>
                      <ShoppingCart className="w-10 h-10" style={{ color: colors.green }} />
                    </div>
                    <p className="font-bold text-slate-500">Your cart is empty</p>
                    <Link 
                      href="/all-products" 
                      onClick={() => setCartOpen(false)}
                      className="px-6 py-3 text-white text-xs font-black uppercase tracking-widest rounded-lg"
                      style={{ backgroundColor: colors.green }}
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black truncate mb-1" style={{ color: colors.green }}>{item.title}</h3>
                        <p className="text-sm font-bold mb-3" style={{ color: colors.gold }}>₹{item.price.toLocaleString()}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-slate-50 text-slate-500"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-slate-50 text-slate-500"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-slate-500">Total</span>
                    <span className="text-2xl font-black" style={{ color: colors.green }}>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <Link
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="block w-full py-5 text-white text-sm font-black uppercase tracking-[0.2em] rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
                    style={{ backgroundColor: colors.green }}
                  >
                    Checkout Now
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
