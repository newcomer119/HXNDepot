'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const Cart = () => {
  const { products, router, cartItems, updateCartQuantity, getCartCount } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-10 mb-10">
            {/* Cart Items */}
            <div className="flex-1">
              <div
                className="flex items-center justify-between mb-8 pb-6"
                style={{ borderBottom: `2px solid ${colors.gold}40` }}
              >
                <div>
                  <span
                    className="text-xs font-black uppercase tracking-[0.3em] mb-2 block"
                    style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}
                  >
                    Shopping Cart
                  </span>
                  <h1
                    className="text-3xl md:text-4xl font-black"
                    style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}
                  >
                    Your Cart
                  </h1>
                </div>
                <p
                  className="text-lg md:text-xl font-bold"
                  style={{ color: colors.green }}
                >
                  {getCartCount()} Items
                </p>
              </div>

              <div
                className="overflow-x-auto rounded-2xl border-2"
                style={{ borderColor: colors.gold + "40" }}
              >
                <table className="min-w-full table-auto">
                  <thead
                    className="text-left"
                    style={{ backgroundColor: colors.goldLight + "30" }}
                  >
                    <tr>
                      <th
                        className="text-nowrap pb-6 md:px-4 px-1 font-black uppercase tracking-widest text-sm"
                        style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}
                      >
                        Product Details
                      </th>
                      <th
                        className="pb-6 md:px-4 px-1 font-black uppercase tracking-widest text-sm"
                        style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}
                      >
                        Price
                      </th>
                      <th
                        className="pb-6 md:px-4 px-1 font-black uppercase tracking-widest text-sm"
                        style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}
                      >
                        Quantity
                      </th>
                      <th
                        className="pb-6 md:px-4 px-1 font-black uppercase tracking-widest text-sm"
                        style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}
                      >
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(cartItems).map((cartKey) => {
                      // Extract productId and color from cartKey (format: productId_color or just productId)
                      const [productId] = cartKey.includes("_")
                        ? cartKey.split("_")
                        : [cartKey];
                      const product = products.find((p) => p._id === productId);
                      const cartItem = cartItems[cartKey];

                      // Handle both old format (number) and new format (object)
                      const quantity =
                        typeof cartItem === "number"
                          ? cartItem
                          : cartItem?.quantity || 0;
                      const color =
                        typeof cartItem === "object" ? cartItem?.color : null;
                      const colorImage =
                        typeof cartItem === "object" ? cartItem?.colorImage : null;

                      if (!product || quantity <= 0) return null;

                      return (
                        <tr key={cartKey}>
                          <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                            <div>
                              <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                                <Image
                                  src={product.image[0]}
                                  alt={product.name}
                                  className="w-16 h-auto object-cover mix-blend-multiply"
                                  width={1280}
                                  height={720}
                                />
                              </div>
                              <button
                                className="md:hidden text-xs font-medium mt-1 transition-colors hover:opacity-70"
                                style={{ color: colors.green }}
                                onClick={() =>
                                  updateCartQuantity(productId, 0, color)
                                }
                              >
                                Remove
                              </button>
                            </div>
                            <div className="text-sm hidden md:block">
                              <p className="text-gray-800">{product.name}</p>
                              {color && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-600">
                                    Color: {color}
                                  </span>
                                  {colorImage && (
                                    <img
                                      src={colorImage}
                                      alt={color}
                                      className="w-10 h-10 rounded-full border border-gray-400"
                                    />
                                  )}
                                </div>
                              )}
                              <button
                                className="text-xs font-medium mt-1 transition-colors hover:opacity-70"
                                style={{ color: colors.green }}
                                onClick={() =>
                                  updateCartQuantity(productId, 0, color)
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                          <td
                            className="py-4 md:px-4 px-1 font-bold"
                            style={{ color: colors.green }}
                          >
                            {product.offerPrice === 0 || product.price === 0 ? (
                              <span className="text-sm">Contact the store</span>
                            ) : (
                              `₹${product.offerPrice}`
                            )}
                          </td>
                          <td className="py-4 md:px-4 px-1">
                            <div className="flex items-center md:gap-2 gap-1">
                              <button
                                onClick={() =>
                                  updateCartQuantity(productId, quantity - 1, color)
                                }
                              >
                                <Image
                                  src={assets.decrease_arrow}
                                  alt="decrease_arrow"
                                  className="w-4 h-4"
                                />
                              </button>
                              <input
                                onChange={(e) =>
                                  updateCartQuantity(
                                    productId,
                                    Number(e.target.value),
                                    color
                                  )
                                }
                                type="number"
                                value={quantity}
                                className="w-8 border text-center appearance-none rounded"
                                style={{ borderColor: colors.gold + "60" }}
                              />
                              <button
                                onClick={() =>
                                  updateCartQuantity(productId, quantity + 1, color)
                                }
                              >
                                <Image
                                  src={assets.increase_arrow}
                                  alt="increase_arrow"
                                  className="w-4 h-4"
                                />
                              </button>
                            </div>
                          </td>
                          <td
                            className="py-4 md:px-4 px-1 font-bold"
                            style={{ color: colors.green }}
                          >
                            {product.offerPrice === 0 || product.price === 0 ? (
                              <span className="text-sm">Contact the store</span>
                            ) : (
                              `₹${(product.offerPrice * quantity).toFixed(2)}`
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => router.push("/all-products")}
                className="group flex items-center mt-6 gap-2 font-black uppercase tracking-widest text-sm transition-all hover:gap-4"
                style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}
              >
                <Image
                  className="group-hover:-translate-x-1 transition-transform"
                  src={assets.arrow_right_icon_colored}
                  alt="arrow_right_icon_colored"
                />
                Continue Shopping
              </button>
            </div>

            {/* Order Summary */}
            <OrderSummary />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
