"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Users, Globe, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const colors = {
  green: "#005a2b",
  gold: "#D4AF37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const values = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "Excellence",
    description: "We source only the highest grade porcelain and fixtures, ensuring every piece meets our rigorous standards."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Customer First",
    description: "Our team of specialists provides personalized consultation to bring your architectural vision to life."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Sourcing",
    description: "We partner with top-tier manufacturers worldwide to bring exclusive designs to our local market."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Reliability",
    description: "Since 2009, we have been a trusted partner for contractors, architects, and homeowners alike."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 border-b-4" style={{ borderColor: colors.gold }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-6">
              <span className="text-xs font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full border-2" 
                style={{ borderColor: colors.gold, color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                Our Story
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
              <span style={{ color: colors.green }}>Redefining </span>
              <span style={{ color: colors.gold }}>Luxury</span>
              <span style={{ color: colors.green }}> In Surfaces</span>
            </h1>
            <div className="w-24 h-1 mx-auto mb-8" style={{ backgroundColor: colors.gold }}></div>
            <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto" style={{ color: colors.green }}>
              HXN Building Depot stands at the forefront of architectural surfaces. We curate the finest flooring, tiles, and bathroom fixtures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] relative rounded-lg overflow-hidden shadow-lg border-4" style={{ borderColor: colors.gold }}>
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=100&auto=format&fit=crop"
                  alt="Modern Architecture"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-12" style={{ backgroundColor: colors.gold }}></div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
                  <span style={{ color: colors.green }}>A Legacy of </span>
                  <span style={{ color: colors.gold }}>Innovation</span>
                </h2>
              </div>
              <p className="text-base leading-relaxed" style={{ color: colors.green }}>
                Founded with a vision to bring world-class porcelain and bathroom solutions to the local market, HXN Building Depot has grown from a small family business into a leading industry distributor.
              </p>
              <p className="text-base leading-relaxed" style={{ color: colors.green }}>
                Our journey is built on the belief that every space deserves the finest materials. We don't just sell tiles; we provide the foundation for your most cherished memories.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-8 border-t-2" style={{ borderColor: colors.gold }}>
                <div>
                  <div className="text-3xl font-bold mb-2" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>15+</div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>Years of Excellence</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>100K+</div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>Dreams Delivered</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20" style={{ backgroundColor: colors.goldLight + "40" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full border-2" 
                style={{ borderColor: colors.gold, color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                Our Values
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              What Drives Us
            </h2>
            <div className="w-16 h-1 mx-auto" style={{ backgroundColor: colors.gold }}></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg border-2 hover:shadow-lg transition-all"
                style={{ borderColor: colors.gold }}
              >
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 border-2" 
                  style={{ backgroundColor: colors.goldLight, borderColor: colors.gold }}>
                  <div style={{ color: colors.gold }}>{value.icon}</div>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>{value.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: colors.green }}>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br rounded-2xl overflow-hidden border-4 relative" 
            style={{ borderColor: colors.gold, background: `linear-gradient(135deg, ${colors.green} 0%, #003d1f 100%)` }}>
            <div className="absolute inset-0 opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=100&auto=format&fit=crop"
                alt="CTA Background"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 py-16 px-8 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
                Ready to Start Your <span style={{ color: colors.gold }}>Next Project?</span>
              </h2>
              <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                Visit our showroom or connect with our specialists today for a personalized consultation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/all-products"
                  className="px-8 py-4 text-white text-sm font-semibold transition-all rounded-lg shadow-lg hover:opacity-90"
                  style={{ backgroundColor: colors.gold, fontFamily: "var(--font-montserrat)" }}
                >
                  Explore Products
                </Link>
                <Link
                  href="/#contact"
                  className="px-8 py-4 border-2 text-sm font-semibold transition-all rounded-lg hover:bg-white/10"
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
