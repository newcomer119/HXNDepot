"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Store, User, Mail, Phone, MapPin, Building2, FileText, Globe, DollarSign } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const productCategories = [
  "Bathroom Products",
  "Floorings",
  "Tiles",
  "Kitchens",
  "Countertops",
  "Lightning"
];

const SellerRegistrationModal = ({ isOpen, onClose }) => {
  const { getToken, setIsLoading } = useAppContext();
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Individual",
    contactPerson: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    taxId: "",
    bankAccountDetails: {
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: ""
    },
    productsCategory: [],
    yearsInBusiness: "",
    website: "",
    description: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else if (name.startsWith("bankAccountDetails.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        bankAccountDetails: { ...prev.bankAccountDetails, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => {
      const isSelected = prev.productsCategory.includes(category);
      return {
        ...prev,
        productsCategory: isSelected
          ? prev.productsCategory.filter(c => c !== category)
          : [...prev.productsCategory, category]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.businessName || !formData.contactPerson || !formData.email || 
        !formData.phone || !formData.address.street || !formData.address.city ||
        !formData.address.state || !formData.address.zipCode || !formData.address.country ||
        !formData.bankAccountDetails.accountHolderName || !formData.bankAccountDetails.accountNumber ||
        !formData.bankAccountDetails.bankName || !formData.bankAccountDetails.routingNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.productsCategory.length === 0) {
      toast.error("Please select at least one product category");
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post("/api/seller/register", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        toast.success("Seller registration submitted successfully! We'll review your application.");
        setFormData({
          businessName: "",
          businessType: "Individual",
          contactPerson: "",
          email: "",
          phone: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
          },
          taxId: "",
          bankAccountDetails: {
            accountHolderName: "",
            accountNumber: "",
            bankName: "",
            routingNumber: ""
          },
          productsCategory: [],
          yearsInBusiness: "",
          website: "",
          description: ""
        });
        onClose();
      } else {
        toast.error(response.data.message || "Failed to submit registration");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Error submitting registration");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-3xl font-black" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              Become a Seller
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" style={{ color: colors.green }} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Business Information */}
            <div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                <Store className="w-5 h-5" />
                Business Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  >
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                    <option value="Partnership">Partnership</option>
                    <option value="LLC">LLC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Tax ID / Business Registration Number
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Years in Business
                  </label>
                  <input
                    type="number"
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                  Business Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 resize-none"
                  style={{ "--tw-ring-color": colors.gold }}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                <MapPin className="w-5 h-5" />
                Business Address
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    State/Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    ZIP/Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bank Account Details */}
            <div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                <DollarSign className="w-5 h-5" />
                Bank Account Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankAccountDetails.accountHolderName"
                    value={formData.bankAccountDetails.accountHolderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankAccountDetails.accountNumber"
                    value={formData.bankAccountDetails.accountNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankAccountDetails.bankName"
                    value={formData.bankAccountDetails.bankName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.green }}>
                    Routing Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankAccountDetails.routingNumber"
                    value={formData.bankAccountDetails.routingNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": colors.gold }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                <Building2 className="w-5 h-5" />
                Product Categories <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm mb-4" style={{ color: colors.green }}>
                Select the categories you want to sell (at least one required)
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                {productCategories.map((category) => (
                  <label
                    key={category}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.productsCategory.includes(category)
                        ? "border-opacity-100"
                        : "border-opacity-30"
                    }`}
                    style={{
                      borderColor: formData.productsCategory.includes(category) ? colors.gold : colors.green,
                      backgroundColor: formData.productsCategory.includes(category) ? colors.goldLight : "transparent"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.productsCategory.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-5 h-5 rounded"
                      style={{ accentColor: colors.green }}
                    />
                    <span className="font-bold" style={{ color: colors.green }}>
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 border-2 rounded-xl font-black transition-all"
                style={{ borderColor: colors.gold, color: colors.gold, fontFamily: "var(--font-montserrat)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-8 py-4 text-white rounded-xl font-black transition-all shadow-xl hover:translate-y-[-2px]"
                style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
              >
                Submit Application
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SellerRegistrationModal;

