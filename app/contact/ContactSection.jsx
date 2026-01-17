"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

export default function ContactSection() {
  return (
    <section id="contact" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-black tracking-[0.4em] uppercase mb-4 block" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
              Connect
            </span>
            <h2 className="text-5xl md:text-6xl font-black mb-12 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
              Let&apos;s Build <span style={{ color: colors.green }}>Together</span>
            </h2>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl shadow-lg flex-shrink-0" style={{ backgroundColor: colors.goldLight }}>
                  <Phone className="w-6 h-6" style={{ color: colors.green }} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: colors.green }}>Direct Line</p>
                  <p className="text-2xl font-black" style={{ color: colors.green }}>+1 (519) 706-6111</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl shadow-lg flex-shrink-0" style={{ backgroundColor: colors.goldLight }}>
                  <Mail className="w-6 h-6" style={{ color: colors.green }} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: colors.green }}>Email Inquiry</p>
                  <p className="text-2xl font-black" style={{ color: colors.green }}>info@hxnbuildingdepot.caa</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl shadow-lg flex-shrink-0" style={{ backgroundColor: colors.goldLight }}>
                  <MapPin className="w-6 h-6" style={{ color: colors.green }} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: colors.green }}>Location</p>
                  <p className="text-xl font-black leading-tight" style={{ color: colors.green }}>Unit.5, 1734 Orangebrook Ct<br />Pickering, ON L1W 3G8</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-50 p-10 rounded-3xl shadow-inner border border-slate-100">
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
