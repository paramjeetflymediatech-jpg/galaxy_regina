import React from 'react';
import {
    FiX,
    FiGrid,
    FiMapPin,
    FiFileText,
    FiPackage,
    FiSearch,
    FiCode,
    FiLogOut,
    FiMessageSquare,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <FiGrid size={18} /> },
    { key: 'quotes', label: 'Quotes', icon: <FiMessageSquare size={18} /> },
    { key: 'locations', label: 'States & Districts', icon: <FiMapPin size={18} /> },
    { key: 'blogs', label: 'Blogs', icon: <FiFileText size={18} /> },
    { key: 'services', label: 'Services', icon: <FiPackage size={18} /> },
    { key: 'seo', label: 'SEO Manager', icon: <FiSearch size={18} /> },
];

const AdminSidebar = ({
    selectedTab,
    setSelectedTab,
    isOpen,
    setIsOpen,
}) => {
    const router = useRouter();

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:sticky top-0 h-screen w-80 bg-[#0F172A] text-white border-r border-white/10 z-[1000] transition-all duration-300 overflow-hidden
                ${isOpen ? 'left-0' : '-left-96'} lg:left-0`}
            >
                {/* Background Glow */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/30">
                                    G
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold tracking-wide">
                                        Galaxy Admin
                                    </h2>
                                    <p className="text-sm text-slate-400">
                                        Control Panel
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="lg:hidden text-slate-400 hover:text-white transition"
                            onClick={() => setIsOpen(false)}
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-3">
                        {menuItems.map((item) => {
                            const active = selectedTab === item.key;

                            return (
                                <button
                                    key={item.key}
                                    onClick={() =>
                                        handleTabClick(item.key)
                                    }
                                    className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 border
                                        
                                        ${
                                            active
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20'
                                                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                        }
                                    `}
                                >
                                    <span
                                        className={`transition-transform duration-300 ${
                                            active
                                                ? 'scale-110'
                                                : 'group-hover:scale-105'
                                        }`}
                                    >
                                        {item.icon}
                                    </span>

                                    <span className="text-sm font-medium tracking-wide">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Bottom Card */}
                    <div className="mt-auto">


                        {/* Logout */}
                        <button
                            onClick={() => {
                                localStorage.removeItem('admin');
                                document.cookie =
                                    'admin=; path=/; max-age=0';
                                router.push('/admin/login');
                            }}
                            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold"
                        >
                            <FiLogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;