import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Banner = () => {
  const router = useRouter();

  const handleShopNow = () => {
    router.push('/all-products');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 bg-[#E6E9F2] my-16 rounded-xl p-12">
      <h2 className="text-3xl md:text-4xl font-semibold max-w-[600px]">
        Explore Our Premium Collection
      </h2>
      <p className="max-w-[500px] font-medium text-gray-800/60 text-lg">
        Discover our wide range of construction materials and building products for your next project
      </p>
      <button 
        onClick={handleShopNow}
        className="group flex items-center justify-center gap-2 px-12 py-3 bg-orange-600 rounded-full text-white hover:bg-orange-700 transition"
      >
        Shop Now
        <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
      </button>
    </div>
  );
};

export default Banner;