"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Users, Globe, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const values = [
  {
    icon: <Award className="w-8 h-8" />,
    title: "Excellence",
    description: "We source only the highest grade porcelain and fixtures, ensuring every piece meets our rigorous standards."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Customer First",
    description: "Our team of specialists provides personalized consultation to bring your architectural vision to life."
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Sourcing",
    description: "We partner with top-tier manufacturers worldwide to bring exclusive designs to our local market."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Reliability",
    description: "Since 2009, we have been a trusted partner for contractors, architects, and homeowners alike."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
            alt="Showroom background"
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
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
              <span style={{ color: colors.green }}>Redefining </span>
              <span style={{ color: colors.gold }}>Luxury</span>
              <span style={{ color: colors.green }}> In Surfaces</span>
            </h1>
            <p className="text-lg md:text-xl font-bold leading-relaxed" style={{ color: colors.green }}>
              HXN Building Depot stands at the forefront of architectural surfaces. We curate the finest flooring, tiles, & Bathroom fixtures.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                  alt="Modern Architecture"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border-8 border-white hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80"
                  alt="Modern Bathroom"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-black leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
                <span style={{ color: colors.green }}>A Legacy of </span>
                <span style={{ color: colors.gold }}>Innovation</span>
                <span style={{ color: colors.green }}> and Trust</span>
              </h2>
              <p className="text-lg font-bold leading-relaxed" style={{ color: colors.green }}>
                Founded with a vision to bring world-class porcelain and bathroom solutions to the local market, HXN Building Depot has grown from a small family business into a leading industry distributor.
              </p>
              <p className="text-lg font-bold leading-relaxed" style={{ color: colors.green }}>
                Our journey is built on the belief that every space deserves the finest materials. We don't just sell tiles; we provide the foundation for your most cherished memories.
              </p>
              <div className="pt-6 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-black mb-1" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>15+</div>
                  <div className="text-xs font-black uppercase tracking-widest" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>Years of Excellence</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-1" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>100K+</div>
                  <div className="text-xs font-black uppercase tracking-widest" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>Dreams Delivered</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: colors.goldLight + "30" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-black tracking-[0.4em] uppercase mb-4 block" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
              Our Values
            </span>
            <h2 className="text-4xl md:text-5xl font-black" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              What Drives Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100 hover:translate-y-[-5px] transition-all"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner" style={{ backgroundColor: colors.goldLight }}>
                  <div style={{ color: colors.green }}>{value.icon}</div>
                </div>
                <h3 className="text-xl font-black mb-4" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>{value.title}</h3>
                <p className="font-bold leading-relaxed" style={{ color: colors.green }}>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
                alt="CTA Background"
                fill
                className="object-cover opacity-20"
              />
            </div>
            <div className="relative z-10 py-24 px-10 text-center max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8" style={{ fontFamily: "var(--font-montserrat)" }}>
                Ready to Start Your <span style={{ color: colors.gold }}>Next Project?</span>
              </h2>
              <p className="text-xl text-slate-300 font-bold mb-12">
                Visit our showroom or connect with our specialists today for a personalized consultation.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/all-products"
                  className="px-10 py-5 text-white text-base font-black transition-all duration-300 group rounded-xl shadow-2xl"
                  style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
                >
                  Explore Products
                </Link>
                <Link
                  href="/#contact"
                  className="px-10 py-5 border-2 text-base font-black transition-all duration-300 rounded-xl"
                  style={{ borderColor: colors.gold, color: colors.gold, fontFamily: "var(--font-montserrat)" }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

