'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const AddAddress = () => {

    const {getToken , router} = useAppContext()

    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        pincode: '',
        area: '',
        city: '',
        state: '',
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try{
            const token = await getToken()
            const {data} = await axios.post('/api/user/add-address', {address}, {headers : {Authorization: `Bearer ${token}`}})

            if(data.success){
                toast.success(data.message)
                router.push('/cart')
            }else{
                toast.error( data.message)
            }


        }catch(error){
            toast.error(error.message)
        }
    }   

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white pt-40 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-12 items-start justify-between">
                        <form onSubmit={onSubmitHandler} className="w-full max-w-2xl">
                            <div className="mb-8">
                                <span className="text-xs font-black uppercase tracking-[0.3em] mb-2 block" style={{ color: colors.gold, fontFamily: "var(--font-montserrat)" }}>
                                    Shipping Information
                                </span>
                                <h1 className="text-3xl md:text-4xl font-black" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                                    Add Shipping Address
                                </h1>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-black uppercase tracking-widest mb-2 block" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                                        Full Name
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold"
                                        style={{ borderColor: colors.gold + '60', color: colors.green }}
                                        onFocus={(e) => e.target.style.borderColor = colors.gold}
                                        onBlur={(e) => e.target.style.borderColor = colors.gold + '60'}
                                        type="text"
                                        placeholder="Enter your full name"
                                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                        value={address.fullName}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-black uppercase tracking-widest mb-2 block" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                                        Phone Number
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold"
                                        style={{ borderColor: colors.gold + '60', color: colors.green }}
                                        onFocus={(e) => e.target.style.borderColor = colors.gold}
                                        onBlur={(e) => e.target.style.borderColor = colors.gold + '60'}
                                        type="text"
                                        placeholder="Enter your phone number"
                                        onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                                        value={address.phoneNumber}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-black uppercase tracking-widest mb-2 block" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                                        Pin Code
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold"
                                        style={{ borderColor: colors.gold + '60', color: colors.green }}
                                        onFocus={(e) => e.target.style.borderColor = colors.gold}
                                        onBlur={(e) => e.target.style.borderColor = colors.gold + '60'}
                                        type="text"
                                        placeholder="Enter pin code"
                                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                        value={address.pincode}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-black uppercase tracking-widest mb-2 block" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                                        Address (Area and Street)
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold resize-none"
                                        style={{ borderColor: colors.gold + '60', color: colors.green }}
                                        onFocus={(e) => e.target.style.borderColor = colors.gold}
                                        onBlur={(e) => e.target.style.borderColor = colors.gold + '60'}
                                        rows={4}
                                        placeholder="Enter your address"
                                        onChange={(e) => setAddress({ ...address, area: e.target.value })}
                                        value={address.area}
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <label className="text-sm font-black uppercase tracking-widest mb-2 block" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                                            City/District/Town
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold"
                                            style={{ borderColor: colors.gold + '60', color: colors.green }}
                                            onFocus={(e) => e.target.style.borderColor = colors.gold}
                                            onBlur={(e) => e.target.style.borderColor = colors.gold + '60'}
                                            type="text"
                                            placeholder="Enter city"
                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                            value={address.city}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-black uppercase tracking-widest mb-2 block" style={{ color: colors.green, fontFamily: "var(--font-montserrat)" }}>
                                            State
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold"
                                            style={{ borderColor: colors.gold + '60', color: colors.green }}
                                            onFocus={(e) => e.target.style.borderColor = colors.gold}
                                            onBlur={(e) => e.target.style.borderColor = colors.gold + '60'}
                                            type="text"
                                            placeholder="Enter state"
                                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                            value={address.state}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full mt-8 py-4 text-white font-black uppercase tracking-widest rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{ backgroundColor: colors.green, fontFamily: "var(--font-montserrat)" }}
                            >
                                Save Address
                            </button>
                        </form>
                        <div className="hidden md:block flex-1 max-w-md">
                            <Image
                                className="w-full"
                                src={assets.my_location_image}
                                alt="my_location_image"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AddAddress;