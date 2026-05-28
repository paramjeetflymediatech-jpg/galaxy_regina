"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';

const AdminLogin = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/admin/login', formData);
            if (response.data.success) {
                localStorage.setItem('admin', JSON.stringify(response.data.admin));
                document.cookie = `admin=${JSON.stringify(response.data.admin)}; path=/; max-age=${7 * 24 * 60 * 60}`;
                toast.success('Welcome back!');
                setTimeout(() => { router.push('/admin'); }, 100);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0F172A]">

            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex flex-col justify-center items-center w-1/2 relative overflow-hidden p-14">
                {/* Background blobs */}
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/3 w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Hero text */}
                <div className="relative flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
                        <FiShield size={14} className="text-cyan-400" />
                        <span className="text-slate-300 text-xs font-medium">Secure Admin Access</span>
                    </div>
                    <h1 className="text-5xl font-black text-white leading-tight mb-6">
                        Manage your<br />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            moving business
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                        Access the Galaxy Movers Regina admin panel to manage quotes, locations, blog posts, services, and more.
                    </p>
                </div>
            </div>

            {/* ── RIGHT PANEL (form) ── */}
            <div className="flex flex-1 items-center justify-center p-6 lg:p-14">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                            G
                        </div>
                        <p className="text-white font-bold text-lg">Galaxy Admin</p>
                    </div>

                    {/* Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm">

                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
                            <p className="text-slate-400 text-sm">Sign in to your admin account to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-300">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="admin@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-300">Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 pl-11 pr-14 py-3.5 rounded-xl text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors text-xs font-semibold"
                                    >
                                        {showPassword ? 'HIDE' : 'SHOW'}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In <FiArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-slate-500 text-sm">
                                Need an account?{' '}
                                <a href="/admin/signup" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                                    Sign up
                                </a>
                            </p>
                        </div> */}
                    </div>

                    {/* Footer note */}
                    <p className="mt-6 text-center text-slate-600 text-xs">
                        🔒 Secured admin access · Galaxy Movers Regina
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;