'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const AddProduct = () => {
  const {getToken, setIsLoading} = useAppContext()
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [category, setCategory] = useState('Earphone');
  const [selectedColorImages, setSelectedColorImages] = useState({});
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

  const availableFragrances = [
    'JASMINE',
    'ASHTAGANDHA',
    'KESAR CHANDAN',
    'LAVENDER',
    'MOGRA',
    'GULAB',
    'LOBHAN',
    'KAPOOR',
    'GUGAL'
  ];

  const handleColorChange = (color) => {
    setSelectedColorImages(prev => {
      if (prev[color] !== undefined) {
        // Deselect: remove color
        const updated = { ...prev };
        delete updated[color];
        return updated;
      } else {
        // Select: add color with no image yet
        return { ...prev, [color]: null };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any files are selected
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    // Check if at least one fragrance is selected (only for Organics)
    if (category === "Organics by Filament Freaks" && Object.keys(selectedColorImages).length === 0) {
      toast.error("Please select at least one fragrance");
      return;
    }

    // Check if every selected fragrance has an image (only for Organics)
    if (category === "Organics by Filament Freaks") {
      const missingImage = Object.entries(selectedColorImages).some(([item, file]) => !file);
      if (missingImage) {
        toast.error("Please upload an image for each selected fragrance");
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('additionalInfo', additionalInfo);
    formData.append('category', category);
    // Only append colors if Organics category (for fragrances)
    if (category === "Organics by Filament Freaks") {
      formData.append('colors', JSON.stringify(Object.keys(selectedColorImages)));
    } else {
      formData.append('colors', JSON.stringify([]));
    }
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);

    // Append each file to formData
    files.forEach((file, index) => {
      if (file) {
        formData.append('images', file);
      }
    });

    // Append each color/fragrance image (only for Organics)
    if (category === "Organics by Filament Freaks") {
      Object.entries(selectedColorImages).forEach(([color, file]) => {
        if (file) {
          formData.append(`colorImages[${color}]`, file);
        }
      });
    }

    try {
      setIsLoading(true); // Start loading
      const token = await getToken();
      if (!token) {
        toast.error("Authentication token not found");
        setIsLoading(false); // Stop loading
        return;
      }
      const { data } = await axios.post('/api/product/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsLoading(false); // Stop loading
      if (data.success) {
        toast.success(data.message);
        // Reset form
        setFiles([]);
        setName('');
        setDescription('');
        setAdditionalInfo('');
        setCategory('Earphone');
        setSelectedColorImages({});
        setPrice('');
        setOfferPrice('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false); // Stop loading on error
      console.error("Error uploading product:", error);
      toast.error(error.message || "Error uploading product");
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input 
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }
                  }} 
                  type="file" 
                  id={`image${index}`} 
                  accept="image/*"
                  hidden 
                />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="additional-info"
          >
            Additional Product Info
          </label>
          <textarea
            id="additional-info"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Enter any additional information here..."
            onChange={(e) => setAdditionalInfo(e.target.value)}
            value={additionalInfo}
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
              <option value="Organics by Filament Freaks">Organics by Filament Freaks</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>

        {/* Fragrance Selection (only for Organics) */}
        {category === "Organics by Filament Freaks" && (
          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium">
              Available Fragrances
            </label>
            <div className="flex flex-wrap gap-3 mt-2">
              {availableFragrances.map((item) => (
                <div key={item} className="flex flex-col items-start">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColorImages[item] !== undefined}
                      onChange={() => handleColorChange(item)}
                      className="w-4 h-4 border-gray-300 rounded focus:ring-2"
                      style={{ accentColor: colors.gold }}
                    />
                    <span className="text-sm">{item}</span>
                  </label>
                  {selectedColorImages[item] !== undefined && (
                    <div className="mt-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files[0];
                          setSelectedColorImages(prev => ({
                            ...prev,
                            [item]: file || null
                          }));
                        }}
                      />
                      {selectedColorImages[item] && (
                        <img
                          src={URL.createObjectURL(selectedColorImages[item])}
                          alt={`${item} preview`}
                          className="w-16 h-16 object-cover mt-1"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {Object.keys(selectedColorImages).length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {Object.keys(selectedColorImages).join(', ')}
              </p>
            )}
          </div>
        )}

        <button type="submit" className="px-8 py-2.5 text-white font-medium rounded transition-colors hover:opacity-90" style={{ backgroundColor: colors.green }}>
          ADD
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;