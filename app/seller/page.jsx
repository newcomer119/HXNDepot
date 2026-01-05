'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

// Define category structure with main categories and subcategories
const categoryStructure = {
    "Bathroom Products": [
      "Toilets",
      "Floating Vanities",
      "Free Standing Vanities",
      "Plain & LED Mirrors",
      "Faucets",
      "Towel Bar Sets",
      "Free Standing Tubs",
      "Tub Faucets",
      "Shower Glass",
      "Shower Drains",
      "Shower Faucets",
      "Tile Edges"
    ],
    "Floorings": [
      "Solid/HardWood Floorings",
      "Engineering Wood Floorings",
      "Vinyl Floorings",
      "Laminate Floorings"
    ],
    "Tiles": [
      "Porcelain Tiles",
      "Mosaic Tiles"
    ],
    "Kitchens": [
      "Melamine Cabinets",
      "MDF Laminates Cabinets",
      "MDF Painted Cabinets",
      "Solid Wood Painted Cabinets"
    ],
    "Countertops": [
      "Quartz Countertop",
      "Granite Countertop",
      "Porcelain Countertop"
    ],
    "Lightning": [
      "Potlights",
      "Chandeliers",
      "Lamps",
      "Vanity Lights",
      "LED Mirrors",
      "Island Lights"
    ]
};

const AddProduct = () => {
  const {getToken, setIsLoading} = useAppContext()
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [mainCategory, setMainCategory] = useState('Bathroom Products');
  const [subCategory, setSubCategory] = useState(categoryStructure['Bathroom Products'][0]);
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  const colors = {
    green: "#005a2b",
    gold: "#d4af37",
    goldLight: "#f4e4bc",
    white: "#ffffff",
  };

  // Update subcategory when main category changes
  const handleMainCategoryChange = (e) => {
    const newMainCategory = e.target.value;
    setMainCategory(newMainCategory);
    // Reset subcategory and set to first available subcategory
    const subcategories = categoryStructure[newMainCategory];
    if (subcategories && subcategories.length > 0) {
      setSubCategory(subcategories[0]);
    } else {
      setSubCategory('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any files are selected
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    // Check if subcategory is selected
    if (!subCategory) {
      toast.error("Please select a subcategory");
      return;
    }

    // Combine main category and subcategory
    const fullCategory = `${mainCategory} - ${subCategory}`;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('additionalInfo', additionalInfo);
    formData.append('category', fullCategory);
    formData.append('colors', JSON.stringify([])); // Empty colors array for real estate products
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);

    // Append each file to formData
    files.forEach((file, index) => {
      if (file) {
        formData.append('images', file);
      }
    });

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
        setMainCategory('Bathroom Products');
        const subcategories = categoryStructure['Bathroom Products'];
        setSubCategory(subcategories && subcategories.length > 0 ? subcategories[0] : '');
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
          <div className="flex flex-col gap-1 w-48">
            <label className="text-base font-medium" htmlFor="main-category">
              Main Category
            </label>
            <select
              id="main-category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={handleMainCategoryChange}
              value={mainCategory}
              required
            >
              {Object.keys(categoryStructure).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-48">
            <label className="text-base font-medium" htmlFor="sub-category">
              Sub Category
            </label>
            <select
              id="sub-category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              required
            >
              {categoryStructure[mainCategory]?.map((subCat) => (
                <option key={subCat} value={subCat}>{subCat}</option>
              ))}
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


        <button type="submit" className="px-8 py-2.5 text-white font-medium rounded transition-colors hover:opacity-90" style={{ backgroundColor: colors.green }}>
          ADD
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;