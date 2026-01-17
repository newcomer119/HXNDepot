"use client";
import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex flex-col md:flex-row w-full px-4 md:px-16 lg:px-32 pt-12 gap-8 flex-1">
        {/* Contact Form */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-3xl font-semibold mb-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>Contact Us</h2>
          <div className="h-1 w-20 mb-8" style={{ backgroundColor: colors.gold }} />
          <ContactForm />
        </div>
        {/* Contact Info */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-3xl font-semibold mb-2" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>Contact Information</h2>
          <div className="h-1 w-20 mb-8" style={{ backgroundColor: colors.gold }} />
          <div className="flex flex-col gap-6 text-lg">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-2xl mt-1" style={{ color: colors.green }} />
              <div>
                <span className="font-bold" style={{ color: colors.green }}>Address</span>
                <div style={{ color: colors.green }}>Unit.5, 1734 Orangebrook Ct,<br />Pickering, ON L1W 3G8</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-2xl" style={{ color: colors.green }} />
              <div>
                <span className="font-bold" style={{ color: colors.green }}>Customer Support</span><br />
                <span style={{ color: colors.green }}>+1 (519) 706-6111</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-2xl" style={{ color: colors.green }} />
              <div>
                <span className="font-bold" style={{ color: colors.green }}>Email</span><br />
                <span style={{ color: colors.green }}>infohxnbuildingdepot.ca</span>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <span className="font-bold text-xl" style={{ color: colors.green }}>FOLLOW US</span>
            <div className="flex gap-5 mt-4 text-2xl">
              <a href="https://www.facebook.com/share/19QKk73BaA/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:opacity-70" style={{ color: colors.green }}><FaFacebook /></a>
              <a href="https://x.com/filament_freaks?s=21" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="transition hover:opacity-70" style={{ color: colors.green }}><FaTwitter /></a>
              <a href="https://www.instagram.com/freaksfilament?igsh=MTBzb3FtNm5paGd2Ng%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:opacity-70" style={{ color: colors.green }}><FaInstagram /></a>
              <a href="https://www.youtube.com/@filament_freaks" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition hover:opacity-70" style={{ color: colors.green }}><FaYoutube /></a>
              <a href="#" aria-label="LinkedIn" className="transition hover:opacity-70" style={{ color: colors.green }}><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 