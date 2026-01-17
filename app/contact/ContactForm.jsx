"use client";
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    setIsSubmitting(true);

    try {
      // EmailJS configuration - these should be set in your .env.local file
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        toast.error("Email service is not configured. Please contact the administrator.");
        setIsSubmitting(false);
        return;
      }

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || "Not provided",
        message: formData.message,
        to_email: "info@hxnbuildingdepot.caa" // Your receiving email
      };

      // Send email using EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input 
          type="text" 
          name="name"
          placeholder="Name" 
          value={formData.name}
          onChange={handleInputChange}
          className="w-full bg-white border border-slate-200 px-5 py-4 focus:outline-none focus:ring-2 rounded-xl transition-all text-lg"
          style={{ "--tw-ring-color": colors.gold }}
          required
        />
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          value={formData.email}
          onChange={handleInputChange}
          className="w-full bg-white border border-slate-200 px-5 py-4 focus:outline-none focus:ring-2 rounded-xl transition-all text-lg"
          style={{ "--tw-ring-color": colors.gold }}
          required
        />
      </div>
      <input 
        type="tel" 
        name="phone"
        placeholder="Phone No." 
        value={formData.phone}
        onChange={handleInputChange}
        className="w-full bg-white border border-slate-200 px-5 py-4 focus:outline-none focus:ring-2 rounded-xl transition-all text-lg"
        style={{ "--tw-ring-color": colors.gold }}
      />
      <textarea 
        name="message"
        placeholder="Your Message..." 
        rows={5} 
        value={formData.message}
        onChange={handleInputChange}
        className="w-full bg-white border border-slate-200 px-5 py-4 focus:outline-none focus:ring-2 rounded-xl transition-all resize-none text-lg"
        style={{ "--tw-ring-color": colors.gold }}
        required
      />
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full text-white py-6 text-base font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
