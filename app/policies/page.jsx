"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Policies = () => {
  const [activeSection, setActiveSection] = useState("our-policies");

  const sections = [
    { id: "our-policies", title: "Our Policies" },
    { id: "terms", title: "Terms and Conditions" },
    { id: "cancellation", title: "Cancellation & Refund" },
    { id: "shipping", title: "Shipping & Delivery" },
    { id: "privacy", title: "Privacy Policies" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0">
              <nav className="space-y-1 bg-white rounded-lg shadow-sm p-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
              {activeSection === "our-policies" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Policies</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600">Our policies are currently being updated. Please check back soon or contact us for more information.</p>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">📧 Email: info@hxnbuildingdepot.ca</p>
                      <p className="text-gray-600">📞 Phone: +1 (519) 706-6111</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "terms" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms and Conditions</h2>
                  <div className="prose max-w-none space-y-4">
                    <p className="text-gray-600">
                      Our terms and conditions are currently being updated. Please contact us for more information.
                    </p>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">📧 Email: info@hxnbuildingdepot.ca</p>
                      <p className="text-gray-600">📞 Phone: +1 (519) 706-6111</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "cancellation" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation & Refund</h2>
                  <div className="prose max-w-none space-y-4">
                    <p className="text-gray-600">
                      Our cancellation and refund policy is currently being updated. Please contact us for more information.
                    </p>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">📧 Email: info@hxnbuildingdepot.ca</p>
                      <p className="text-gray-600">📞 Phone: +1 (519) 706-6111</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "shipping" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping & Delivery</h2>
                  <div className="prose max-w-none space-y-4">
                    <p className="text-gray-600">
                      For any questions about shipping and delivery, please contact us:
                    </p>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">📧 Email: info@hxnbuildingdepot.ca</p>
                      <p className="text-gray-600">📞 Phone: +1 (519) 706-6111</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "privacy" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policies</h2>
                  <div className="prose max-w-none space-y-4">
                    <p className="text-gray-600">
                      Our privacy policy is currently being updated. Please contact us for more information.
                    </p>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">📧 Email: info@hxnbuildingdepot.ca</p>
                      <p className="text-gray-600">📞 Phone: +1 (519) 706-6111</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Policies;
