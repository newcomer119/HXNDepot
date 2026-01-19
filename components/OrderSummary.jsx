import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "@/assets/assets";
import Image from "next/image";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cart,
    setCartItems,
    cartItems,
    products,
  } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const paymentMethod = 'COD';
  const [userAddresses, setUserAddresses] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCouponValid, setIsCouponValid] = useState(false);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses && data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };


  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    
    if (code === 'FIRST25') {
      setAppliedCoupon({
        code: code,
        discount: 25,
        type: 'percentage'
      });
      setIsCouponValid(true);
      toast.success('Coupon applied successfully! 25% off');
    } else {
      setAppliedCoupon(null);
      setIsCouponValid(false);
      toast.error('Invalid coupon code');
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = getCartAmount();
    if (appliedCoupon.type === 'percentage') {
      return Math.floor(subtotal * (appliedCoupon.discount / 100));
    }
    return 0;
  };

  // Compute GST with 5% for Organic products and 18% for others, proportionally after discount
  const computeGst = () => {
    const subtotal = getCartAmount();
    const discount = calculateDiscount();
    const discountedSubtotal = subtotal - discount;

    if (subtotal <= 0 || discountedSubtotal <= 0) return 0;

    let organicGross = 0;
    let otherGross = 0;

    for (const key in cartItems) {
      const cartItem = cartItems[key];
      if (!cartItem || cartItem.quantity <= 0) continue;
      const productId = key.split('_')[0];
      const product = products.find(p => p._id === productId);
      if (!product) continue;
      const lineTotal = (product.offerPrice || 0) * cartItem.quantity;
      if (product.category && product.category.includes("Building Materials")) {
        organicGross += lineTotal;
      } else {
        otherGross += lineTotal;
      }
    }

    const totalGross = organicGross + otherGross;
    if (totalGross <= 0) return 0;

    const organicPortion = (organicGross / totalGross) * discountedSubtotal;
    const otherPortion = discountedSubtotal - organicPortion;

    return Math.floor(organicPortion * 0.05 + otherPortion * 0.18);
  };

  const getFinalAmount = () => {
    const subtotal = getCartAmount();
    const discount = calculateDiscount();
    const discountedSubtotal = subtotal - discount;
    const gst = computeGst();
    return discountedSubtotal + gst;
  };


  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error('Please select an address')
      }

      // Convert cart items to order format
      let cartItemsArray = Object.keys(cartItems).map((cartKey) => {
        const cartItem = cartItems[cartKey];
        const [productId, ...colorParts] = cartKey.split('_');
        const color = colorParts.length > 0 ? colorParts.join('_') : null;
        return {
          product: productId,
          quantity: cartItem.quantity,
          color: color
        };
      });
      
      cartItemsArray = cartItemsArray.filter(item => item.quantity > 0)

      if (cartItemsArray.length === 0) {
        return toast.error("cart is empty")
      }

      // Create order (COD only)
      const token = await getToken()
      const { data } = await axios.post('/api/order/create', {
        address: selectedAddress._id,
        items: cartItemsArray,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        discount: calculateDiscount()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success(data.message)
        setCartItems({})
        
        // Store order details
        if (data.order) {
          const orderDetails = {
            customOrderId: data.order.customOrderId,
            totalAmount: data.order.amount,
            items: data.order.items || []
          };
          localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
        }
        
        router.push('/order-placed')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  return (
    <div className="w-full md:w-96 rounded-2xl border-2 p-6 shadow-lg" style={{ borderColor: colors.gold + '40', backgroundColor: colors.goldLight + '10' }}>
      <h2 className="text-xl md:text-2xl font-black mb-6" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
        Order Summary
      </h2>
      <div className="w-full h-0.5 mb-6" style={{ backgroundColor: colors.gold + '40' }}></div>
      <div className="space-y-6">
        <div>
          <label className="text-sm font-black uppercase tracking-widest block mb-3" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
            Select Address
          </label>
          <div className="relative inline-block w-full">
            <button
              className="w-full text-left px-4 pr-10 py-3 rounded-xl border-2 transition-all font-bold"
              style={{ 
                borderColor: colors.gold + '60', 
                color: colors.green,
                backgroundColor: 'white'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = colors.gold}
              onMouseLeave={(e) => e.target.style.borderColor = colors.gold + '60'}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="block truncate">
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                style={{ color: colors.gold }}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border-2 shadow-xl mt-2 z-20 rounded-xl overflow-hidden" style={{ borderColor: colors.gold }}>
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-3 cursor-pointer transition-colors font-bold border-b last:border-b-0"
                    style={{ 
                      color: colors.green,
                      borderColor: colors.gold + '30'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = colors.goldLight + '30'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-3 cursor-pointer text-center font-black uppercase tracking-widest transition-colors"
                  style={{ 
                    color: colors.gold,
                    backgroundColor: colors.goldLight + '20'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = colors.goldLight + '40'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = colors.goldLight + '20'}
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="w-full h-0.5" style={{ backgroundColor: colors.gold + '40' }}></div>

        <div className="space-y-4">
          <div className="flex justify-between text-base font-bold">
            <p className="uppercase tracking-widest text-sm" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>Items {getCartCount()}</p>
            <p style={{ color: colors.green }}>
              {currency}
              {getCartAmount()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="font-bold" style={{ color: colors.green }}>Shipping Fee</p>
            <p className="font-bold" style={{ color: colors.gold }}>Free</p>
          </div>
          
          {/* Discount line - Moved here below shipping fees */}
          {appliedCoupon && (
            <div className="flex justify-between font-bold">
              <p style={{ color: colors.green }}>Discount ({appliedCoupon.discount}%)</p>
              <p style={{ color: colors.green }}>
                -{currency}
                {calculateDiscount()}
              </p>
            </div>
          )}
          
          <div className="flex justify-between">
            <p className="font-bold" style={{ color: colors.green }}>GST</p>
            <p className="font-bold" style={{ color: colors.green }}>
              {currency}
              {computeGst()}
            </p>
          </div>
          
          {/* Promo Code Section - Moved here after GST */}
          <div className="pt-4 border-t-2" style={{ borderColor: colors.gold + '40' }}>
            <label className="text-sm font-black uppercase tracking-widest block mb-3" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              Promo Code
            </label>
            <div className="flex flex-col items-start gap-3">
              <input
                type="text"
                placeholder="Enter promo code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 outline-none font-bold transition-all"
                style={{ borderColor: colors.gold + '60', color: colors.green }}
                onFocus={(e) => e.target.style.borderColor = colors.gold}
                onBlur={(e) => e.target.style.borderColor = colors.gold + '60'}
              />
              <button 
                onClick={handleApplyCoupon}
                className="px-8 py-3 font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: colors.gold, color: colors.green, fontFamily: "var(--font-montserrat)" }}
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div className="mt-3 p-3 rounded-xl border-2" style={{ backgroundColor: colors.goldLight + '30', borderColor: colors.gold }}>
                <p className="text-sm font-bold" style={{ color: colors.green }}>
                  Coupon "{appliedCoupon.code}" applied! {appliedCoupon.discount}% off
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between text-lg md:text-xl font-black border-t-2 pt-4" style={{ borderColor: colors.gold + '40' }}>
            <p style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>Total</p>
            <p style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
              {currency}
              {getFinalAmount()}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full py-4 text-white font-black uppercase tracking-widest rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-6"
        style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
