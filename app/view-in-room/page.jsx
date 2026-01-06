"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TilesViewModal from "@/components/TilesViewModal";
import Link from "next/link";

const colors = {
  green: "#005a2b",
  gold: "#D4AF37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const steps = [
  {
    number: "01",
    title: "Launch TilesView",
    description: "Click the button below to open TilesView AI visualization tool in your browser.",
  },
  {
    number: "02",
    title: "Upload Room Photo",
    description: "Upload a clear photo of your room. Ensure good lighting and visible floor or wall surfaces.",
  },
  {
    number: "03",
    title: "Browse Products",
    description: "Explore our catalog of tiles, flooring, and bathroom products directly within TilesView.",
  },
  {
    number: "04",
    title: "Visualize & Compare",
    description: "See products rendered in your space in real-time. Compare different options side by side.",
  },
];

export default function ViewInRoom() {
  const [showTilesView, setShowTilesView] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              View Products in Your Room
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12" style={{ color: "#4a5568" }}>
              Use our AR visualization tool to see how our tiles, flooring, and bathroom products look in your actual space before making a purchase.
            </p>
            
            <button
              onClick={() => setShowTilesView(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: colors.green, color: colors.white, fontFamily: "var(--font-montserrat)" }}
            >
              <Eye className="w-5 h-5" />
              Open TilesView
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-12 text-center" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="border-l-2 pl-6 pb-8" style={{ borderColor: colors.gold }}>
                    <div className="text-sm font-bold mb-2" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                      {step.number}
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                Real-Time Visualization
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                See products rendered in your space instantly with accurate lighting and perspective.
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                Full Product Catalog
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                Access our complete range of tiles, flooring, and bathroom fixtures within the tool.
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                Easy Comparison
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                Compare multiple products side by side in your actual room environment.
              </p>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-gray-50 rounded-lg p-8 md:p-12 mb-16">
            <h3 className="text-xl font-semibold mb-6" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              Best Practices for Best Results
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-sm font-medium mt-0.5" style={{ color: colors.green }}>•</span>
                  <span className="text-sm" style={{ color: "#4a5568" }}>Use natural lighting when possible</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sm font-medium mt-0.5" style={{ color: colors.green }}>•</span>
                  <span className="text-sm" style={{ color: "#4a5568" }}>Take photos from eye level (5-6 feet high)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sm font-medium mt-0.5" style={{ color: colors.green }}>•</span>
                  <span className="text-sm" style={{ color: "#4a5568" }}>Ensure floor or wall surfaces are clearly visible</span>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-sm font-medium mt-0.5" style={{ color: colors.green }}>•</span>
                  <span className="text-sm" style={{ color: "#4a5568" }}>Remove clutter for clearer visualization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sm font-medium mt-0.5" style={{ color: colors.green }}>•</span>
                  <span className="text-sm" style={{ color: "#4a5568" }}>Use high-resolution images (minimum 1920x1080)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sm font-medium mt-0.5" style={{ color: colors.green }}>•</span>
                  <span className="text-sm" style={{ color: "#4a5568" }}>Capture the entire area you want to visualize</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center border-t border-gray-200 pt-12">
            <p className="text-base mb-6" style={{ color: "#4a5568" }}>
              Browse our product catalog to find items you'd like to visualize
            </p>
            <Link
              href="/all-products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 border"
              style={{ borderColor: colors.green, color: colors.green, fontFamily: "var(--font-montserrat)" }}
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* TilesView Modal */}
      <TilesViewModal isOpen={showTilesView} onClose={() => setShowTilesView(false)} />

      <Footer />
    </div>
  );
}
