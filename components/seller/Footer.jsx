import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const Footer = () => {
  return (
    <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-10 py-4" style={{ borderTop: `1px solid ${colors.gold}40` }}>
      <div className="flex items-center gap-4">
        <p className="py-4 text-center text-xs md:text-sm" style={{ color: colors.green + 'CC' }}>
          Copyright 2025  All Right Reserved.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <a href="#">
          <Image src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        <a href="#">
          <Image src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href="#">
          <Image src={assets.instagram_icon} alt="instagram_icon" />
        </a>
      </div>
    </div>
  );
};

export default Footer;