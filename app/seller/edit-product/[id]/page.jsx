'use client'
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

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

const EditProduct = () => {
    const { id } = useParams();
    const router = useRouter();
    const { getToken, setIsLoading, isLoading } = useAppContext();

    const [productData, setProductData] = useState(null);
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [mainCategory, setMainCategory] = useState('Bathroom Products');
    const [subCategory, setSubCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const token = await getToken();
                const { data } = await axios.get(`/api/product/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (data.success) {
                    const product = data.product;
                    setProductData(product);
                    setName(product.name);
                    setDescription(product.description);
                    setAdditionalInfo(product.additionalInfo || '');
                    setPrice(product.price);
                    setOfferPrice(product.offerPrice);
                    setExistingImages(product.image || []);
                    
                    // Parse category to extract main and sub category
                    if (product.category && product.category.includes(' - ')) {
                        const [main, ...subParts] = product.category.split(' - ');
                        const sub = subParts.join(' - ');
                        setMainCategory(main);
                        setSubCategory(sub);
                    } else {
                        // Fallback: try to find matching main category
                        const mainCat = Object.keys(categoryStructure).find(cat => 
                            product.category?.startsWith(cat)
                        );
                        if (mainCat) {
                            setMainCategory(mainCat);
                            const subcats = categoryStructure[mainCat];
                            if (subcats && subcats.length > 0) {
                                setSubCategory(subcats[0]);
                            }
                        }
                    }

                } else {
                    toast.error(data.message);
                    router.push('/seller/product-list');
                }
            } catch (error) {
                toast.error("Failed to fetch product data.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, [id, getToken, setIsLoading, router]);

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
    
    const handleImageChange = (e, index) => {
        if (e.target.files[0]) {
            const updatedFiles = [...files];
            updatedFiles[index] = e.target.files[0];
            setFiles(updatedFiles);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if subcategory is selected
        if (!subCategory) {
            toast.error("Please select a subcategory");
            return;
        }

        setIsLoading(true);

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
        
        // Append new product images
        files.forEach((file) => {
            if (file) {
                formData.append('images', file);
            }
        });

        try {
            const token = await getToken();
            const { data } = await axios.put(`/api/product/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success("Product updated successfully!");
                router.push('/seller/product-list');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error(error.response?.data?.message || "Error updating product");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading || !productData) {
        return <Loading />;
    }

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
                <h1 className="text-2xl font-semibold">Edit Product</h1>
                
                <div>
                    <p className="text-base font-medium">Product Images</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {[...Array(4)].map((_, index) => (
                            <div key={index}>
                                <label htmlFor={`image${index}`}>
                                    <input 
                                        onChange={(e) => handleImageChange(e, index)} 
                                        type="file" 
                                        id={`image${index}`} 
                                        accept="image/*"
                                        hidden 
                                    />
                                    <Image
                                        className="max-w-24 cursor-pointer"
                                        src={files[index] ? URL.createObjectURL(files[index]) : (existingImages[index] || assets.upload_area)}
                                        alt="Product image"
                                        width={100}
                                        height={100}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input id="product-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea id="product-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" required></textarea>
                </div>
                
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="additional-info">Additional Product Info</label>
                    <textarea id="additional-info" rows={4} value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"></textarea>
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
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input id="product-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input id="offer-price" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>

                <button type="submit" className="px-8 py-2.5 text-white font-medium rounded transition-colors hover:opacity-90" style={{ backgroundColor: colors.green }}>
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProduct; 