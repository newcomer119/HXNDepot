"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const TILESVIEW_TOKEN = "NTE4NTE3dGlsZXNwcmV2aWV3XzE5OTQ=";

const TilesViewModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
              View in Your Room
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Iframe Container */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl bg-white">
            <iframe
              src={`https://tilesview.ai/app/login.php?login_backend=${TILESVIEW_TOKEN}`}
              width="100%"
              height="100%"
              allowFullScreen
              style={{ border: "none", minHeight: "800px" }}
              className="w-full h-full"
            />
          </div>

          {/* Footer Info */}
          <div className="mt-4 text-center">
            <p className="text-white/70 text-sm">
              Use TilesView AI to visualize this product in your space
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TilesViewModal;

