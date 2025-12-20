import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "@/assets/assets";
import Image from "next/image";

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
      if (product.category === "Organics by Filament Freaks") {
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
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
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
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>


        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">
              {currency}
              {getCartAmount()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          
          {/* Discount line - Moved here below shipping fees */}
          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <p>Discount ({appliedCoupon.discount}%)</p>
              <p className="font-medium">
                -{currency}
                {calculateDiscount()}
              </p>
            </div>
          )}
          
          <div className="flex justify-between">
            <p className="text-gray-600">GST</p>
            <p className="font-medium text-gray-800">
              {currency}
              {computeGst()}
            </p>
          </div>
          
          {/* Promo Code Section - Moved here after GST */}
          <div className="border-t pt-4">
            <label className="text-base font-medium uppercase text-gray-600 block mb-2">
              Promo Code
            </label>
            <div className="flex flex-col items-start gap-3">
              <input
                type="text"
                placeholder="Enter promo code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
              />
              <button 
                onClick={handleApplyCoupon}
                className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
                <p className="text-green-800 text-sm">
                  Coupon "{appliedCoupon.code}" applied! {appliedCoupon.discount}% off
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {getFinalAmount()}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
