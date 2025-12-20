"use client";

import Link from "next/link";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

export default function Footer() {
  return (
    <footer className="py-20" style={{ backgroundColor: colors.green }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex flex-col items-start leading-none mb-8">
              <span 
                className="text-xl font-bold tracking-tight mb-1"
                style={{ color: colors.gold, fontFamily: "var(--font-cinzel)" }}
              >
                HXN BUILDING DEPOT
              </span>
              <span className="text-[10px] italic font-medium tracking-widest text-white/80" style={{ fontFamily: "var(--font-lora)" }}>
                Materials & Constructions
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-8" style={{ fontFamily: "var(--font-lora)" }}>
              Defining the standard for luxury architectural surfaces since 2009. Quality without compromise.
            </p>
          </div>

          <div>
            <h4 
              className="font-semibold text-xs uppercase tracking-widest mb-6"
              style={{ color: colors.gold, fontFamily: "var(--font-cinzel)" }}
            >
              Architecture
            </h4>
            <ul className="space-y-4 text-white/70 text-sm" style={{ fontFamily: "var(--font-lora)" }}>
              <li><Link href="/all-products" className="hover:text-white transition-colors">Porcelain Slab</Link></li>
              <li><Link href="/all-products" className="hover:text-white transition-colors">Marble Finish</Link></li>
              <li><Link href="/all-products" className="hover:text-white transition-colors">Wood Textures</Link></li>
              <li><Link href="/all-products" className="hover:text-white transition-colors">Stone Look</Link></li>
            </ul>
          </div>

          <div>
            <h4 
              className="font-semibold text-xs uppercase tracking-widest mb-6"
              style={{ color: colors.gold, fontFamily: "var(--font-cinzel)" }}
            >
              Company
            </h4>
            <ul className="space-y-4 text-white/70 text-sm" style={{ fontFamily: "var(--font-lora)" }}>
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/all-products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/#products" className="hover:text-white transition-colors">Showrooms</Link></li>
              <li><Link href="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 
              className="font-semibold text-xs uppercase tracking-widest mb-6"
              style={{ color: colors.gold, fontFamily: "var(--font-cinzel)" }}
            >
              Connect
            </h4>
            <ul className="space-y-4 text-white/70 text-sm" style={{ fontFamily: "var(--font-lora)" }}>
              <li><Link href="/policies" className="hover:text-white transition-colors">Policies</Link></li>
              <li><Link href="/my-orders" className="hover:text-white transition-colors">My Orders</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p 
            className="text-white/50 text-[10px] font-semibold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            © 2024 HXN BUILDING DEPOT. ALL RIGHTS RESERVED.
          </p>
          <div 
            className="flex gap-8 text-white/50 text-[10px] font-semibold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            <Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
