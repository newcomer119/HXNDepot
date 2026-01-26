'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShippingAndDelivery = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping & Delivery</h1>
            <div className="space-y-6 text-gray-700">
              <section>
                <p className="text-gray-600 mb-4">
                  For any questions about shipping and delivery, please contact us:
                </p>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">📧 Email: info@hxnbuildingdepot.ca</p>
                  <p className="text-gray-600">📞 Phone: +1 (519) 706-6111</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingAndDelivery;
