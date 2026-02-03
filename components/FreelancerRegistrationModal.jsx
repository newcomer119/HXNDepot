"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Briefcase, MapPin, FileText } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const freelancerCategories = [
  "Installer",
  "Constructor",
  "Real Estate Agent",
  "Interior Designer",
  "Flooring Specialist",
  "Tile Installer",
  "General Contractor",
  "Plumber",
  "Electrician",
  "Painter",
  "Other",
];

export default function FreelancerRegistrationModal({ isOpen, onClose }) {
  const { getToken, setIsLoading } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    experienceYears: "",
    serviceArea: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.category) {
      toast.error("Please fill in name, email, phone, and category.");
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken?.();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        : { headers: { "Content-Type": "application/json" } };
      const response = await axios.post("/api/freelancer/register", formData, config);

      if (response.data.success) {
        toast.success("Registration submitted! You're now listed in Find a Pro.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          category: "",
          experienceYears: "",
          serviceArea: "",
          description: "",
        });
        onClose();
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting registration.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between rounded-t-3xl z-10">
            <h2 className="text-2xl font-black" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              Register as a Pro
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6" style={{ color: colors.green }} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.gold }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": colors.gold }}
                  placeholder="John Smith"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.gold }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": colors.gold }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.gold }} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": colors.gold }}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10" style={{ color: colors.gold }} />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 appearance-none bg-white"
                  style={{ "--tw-ring-color": colors.gold }}
                  required
                >
                  <option value="">Select your category</option>
                  {freelancerCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                Years of Experience
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": colors.gold }}
                placeholder="e.g. 5"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                Service Area
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.gold }} />
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": colors.gold }}
                  placeholder="e.g. Toronto GTA, Ontario"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                Short description (optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 w-5 h-5" style={{ color: colors.gold }} />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 resize-none"
                  style={{ "--tw-ring-color": colors.gold }}
                  placeholder="Services you offer, specialties..."
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border-2 font-bold transition-colors"
                style={{ borderColor: colors.gold, color: colors.green }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: colors.green }}
              >
                Register as Pro
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
