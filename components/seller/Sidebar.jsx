import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const colors = {
  green: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const SideBar = () => {
    const pathname = usePathname()
    const menuItems = [
        { name: 'Add Product', path: '/seller', icon: assets.add_icon },
        { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
        { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
    ];

    return (
        <div className='md:w-64 w-16 border-r min-h-screen text-base py-2 flex flex-col' style={{ borderColor: colors.gold + '40' }}>
            {menuItems.map((item) => {

                const isActive = pathname === item.path;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            className={
                                `flex items-center py-3 px-4 gap-3 transition-colors ${isActive
                                    ? "border-r-4 md:border-r-[6px] border-white"
                                    : "hover:border-white border-white"
                                }`
                            }
                            style={isActive ? {
                                backgroundColor: colors.goldLight + '30',
                                borderRightColor: colors.gold
                            } : {
                                backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = colors.goldLight + '20';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <Image
                                src={item.icon}
                                alt={`${item.name.toLowerCase()}_icon`}
                                className="w-7 h-7"
                                width={28}
                                height={28}
                                style={isActive ? { filter: 'brightness(0) saturate(100%) invert(45%) sepia(95%) saturate(500%) hue-rotate(5deg) brightness(1.1) contrast(1.1)' } : {}}
                            />
                            <p className='md:block hidden text-center' style={{ color: isActive ? colors.green : '#374151', fontWeight: isActive ? '600' : '400' }}>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
