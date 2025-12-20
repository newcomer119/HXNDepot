"use client";
import { createContext, useContext } from "react";
import { useAppContext } from "./AppContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const {
    cartItems,
    products,
    getCartCount,
    getCartAmount,
    updateCartQuantity,
    router,
  } = useAppContext();

  // Convert cartItems to array format for the new Navbar
  const cart = Object.keys(cartItems)
    .map((cartKey) => {
      const cartItem = cartItems[cartKey];
      const [productId] = cartKey.split("_");
      const product = products.find((p) => p._id === productId);

      if (!product || !cartItem || cartItem.quantity <= 0) return null;

      return {
        id: cartKey,
        productId: productId,
        title: product.name,
        price: product.offerPrice,
        quantity: cartItem.quantity,
        image: product.image?.[0] || "/placeholder.jpg",
        color: cartItem.color,
      };
    })
    .filter(Boolean);

  const removeFromCart = async (itemId) => {
    const [productId, ...colorParts] = itemId.split("_");
    const color = colorParts.length > 0 ? colorParts.join("_") : null;
    await updateCartQuantity(productId, 0, color);
  };

  const updateQuantity = async (itemId, quantity) => {
    const [productId, ...colorParts] = itemId.split("_");
    const color = colorParts.length > 0 ? colorParts.join("_") : null;
    const cartItem = cartItems[itemId];
    await updateCartQuantity(productId, quantity, color, cartItem?.colorImage);
  };

  const cartCount = getCartCount();
  const totalAmount = getCartAmount();

  const value = {
    cart,
    cartCount,
    totalAmount,
    removeFromCart,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

