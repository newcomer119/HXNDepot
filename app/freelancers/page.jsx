"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FreelancerRegistrationModal from "@/components/FreelancerRegistrationModal";
import { motion } from "framer-motion";
import { Briefcase, Mail, Phone, MapPin, UserPlus, ArrowRight } from "lucide-react";
import axios from "axios";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const placeholderFreelancers = [
  { name: "Alex Chen", category: "Flooring Specialist", serviceArea: "Toronto GTA", experienceYears: 8, description: "Premium hardwood and tile installation.", email: "alex@example.com", phone: "+1 (416) 555-0100", _id: "placeholder-1" },
  { name: "Maria Santos", category: "Interior Designer", serviceArea: "Ontario", experienceYears: 12, description: "Residential and commercial design.", email: "maria@example.com", phone: "+1 (416) 555-0101", _id: "placeholder-2" },
  { name: "James Wilson", category: "General Contractor", serviceArea: "Greater Toronto", experienceYears: 15, description: "Full renovation and construction.", email: "james@example.com", phone: "+1 (416) 555-0102", _id: "placeholder-3" },
];

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const url = categoryFilter
          ? `/api/freelancer/list?category=${encodeURIComponent(categoryFilter)}`
          : "/api/freelancer/list";
        const { data } = await axios.get(url);
        if (data.success && data.freelancers?.length) {
          setFreelancers(data.freelancers);
        } else {
          setFreelancers(placeholderFreelancers);
        }
      } catch {
        setFreelancers(placeholderFreelancers);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancers();
  }, [categoryFilter]);

  const categories = [
    "Installer", "Constructor", "Real Estate Agent", "Interior Designer",
    "Flooring Specialist", "Tile Installer", "General Contractor", "Plumber",
    "Electrician", "Painter", "Other",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-40 pb-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: colors.gold }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                  Find a Pro
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                Installers, Constructors & Pros
              </h1>
              <p className="text-slate-600 max-w-2xl text-lg" style={{ fontFamily: "var(--font-montserrat)" }}>
                Connect with vetted professionals for flooring, construction, real estate, and more. Register to be listed here.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
            >
              <UserPlus className="w-5 h-5" />
              Register as a Pro
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setCategoryFilter("")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${!categoryFilter ? "text-white" : "border-2"}`}
              style={!categoryFilter ? { backgroundColor: colors.green } : { borderColor: colors.gold, color: colors.green }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${categoryFilter === cat ? "text-white" : "border-2"}`}
                style={categoryFilter === cat ? { backgroundColor: colors.green } : { borderColor: colors.gold, color: colors.green }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freelancers.map((pro, index) => (
                <motion.div
                  key={pro._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-gold/30"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.gold}20` }}>
                        <Briefcase className="w-7 h-7" style={{ color: colors.green }} />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${colors.gold}25`, color: colors.green }}>
                        {pro.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-black mb-1" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                      {pro.name}
                    </h3>
                    {pro.experienceYears != null && (
                      <p className="text-sm text-slate-500 mb-3">{pro.experienceYears} years experience</p>
                    )}
                    {pro.description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{pro.description}</p>
                    )}
                    {pro.serviceArea && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                        <MapPin className="w-4 h-4" style={{ color: colors.gold }} />
                        {pro.serviceArea}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                      <a href={`mailto:${pro.email}`} className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: colors.green }}>
                        <Mail className="w-4 h-4" /> Email
                      </a>
                      <a href={`tel:${pro.phone}`} className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: colors.green }}>
                        <Phone className="w-4 h-4" /> Call
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">Are you an installer, constructor, or real estate professional?</p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold border-2 transition-all hover:scale-105"
              style={{ borderColor: colors.gold, color: colors.green }}
            >
              <UserPlus className="w-5 h-5" />
              Register to be listed here
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <FreelancerRegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
}
