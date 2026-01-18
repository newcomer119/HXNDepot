import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router, setIsLoading, isLoading } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("3d-printed");

  const handleSeeMore = () => {
    setIsLoading(true);
    router.push("/all-products");
  };

  // Filter products based on selected category
  const filteredProducts = products.filter(product => {
    if (!product.category) return false;
    
    if (selectedCategory === "3d-printed") {
      // Match "Accessories" category or any category starting with "Accessories - "
      return product.category === "Accessories" || 
             product.category.startsWith("Accessories - ");
    } else {
      // Match "Organics by Filament Freaks" category or any category starting with it
      return product.category === "Organics by Filament Freaks" || 
             product.category.startsWith("Organics by Filament Freaks - ");
    }
  });

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex flex-col items-start w-full mb-6">
        <p className="text-2xl font-medium text-left w-full mb-4">Popular products</p>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedCategory("3d-printed")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === "3d-printed"
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            3D Printed Products
          </button>
          <button
            onClick={() => setSelectedCategory("organic")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === "organic"
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Organic By FilamentFreaks
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {isLoading && products.length === 0
          ? [...Array(10)].map((_, index) => (
              <div
                key={index}
                className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"
              ></div>
            ))
          : filteredProducts
              .map((product, index) => (
                <ProductCard key={product._id || index} product={product} />
              ))}
      </div>
      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12 w-full">
          <p className="text-xl font-semibold text-gray-700 mb-2">
            Products Coming Soon
          </p>
          <p className="text-gray-500">
            We're currently preparing our product catalog. Products will be uploaded soon.
          </p>
        </div>
      )}
      {filteredProducts.length > 0 && (
        <button
          onClick={handleSeeMore}
          className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
        >
          See more
        </button>
      )}
    </div>
  );
};

export default HomeProducts;
