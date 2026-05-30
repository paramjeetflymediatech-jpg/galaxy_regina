"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FiMapPin, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import Navbar from '@/src/components/Navbar/Navbar';
import Footer from '@/src/components/Footer/Footer';
import Link from 'next/link';

export default function LocationsPage() {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [services, setServices] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [provRes, distRes, cityRes, servicesRes] = await Promise.all([
                    axios.get('/api/provinces'),
                    axios.get('/api/districts'),
                    axios.get('/api/locations'),
                    axios.get('/api/services')
                ]);
                setProvinces(provRes.data.provinces || []);
                setDistricts(distRes.data.districts || []);
                setCities(cityRes.data.locations || []);
                setServices(servicesRes.data.services || []);
            } catch (error) {
                console.error("Failed to fetch location data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Derived filtered lists
    const availableDistricts = useMemo(() => {
        if (!selectedProvince) return [];
        return districts.filter(d => d.province_id === parseInt(selectedProvince, 10));
    }, [selectedProvince, districts]);

    const availableCities = useMemo(() => {
        if (!selectedDistrict) return [];
        return cities.filter(c => c.district_id === parseInt(selectedDistrict, 10));
    }, [selectedDistrict, cities]);

    // Handle Dropdown Changes
    const handleProvinceChange = (e) => {
        setSelectedProvince(e.target.value);
        setSelectedDistrict("");
        setSelectedCity("");
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrict(e.target.value);
        setSelectedCity("");
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };

    // Selected Target City details
    const targetCity = useMemo(() => {
        if (!selectedCity) return null;
        return cities.find(c => c.id === parseInt(selectedCity, 10));
    }, [selectedCity, cities]);

    return (
        <main className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto pb-24 pt-20 px-4 sm:px-6 lg:px-8 w-full">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 bg-[#CC0336]/10 text-[#CC0336] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        <FiMapPin size={12} /> National Network
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#06056C] tracking-tight max-w-4xl mx-auto leading-none">
                        Find Moving Crews <br/><span className="text-[#CC0336]">Across REGINA</span>
                    </h1>
                    <div className="w-16 h-1.5 bg-[#CC0336] mx-auto rounded-full mb-6"></div>
                    <p className="text-lg text-gray-500 font-medium px-4">
                        Select your Province, Region, and City to explore specialized<br className="hidden md:block" /> residential, commercial, packing, and storage services in your local<br className="hidden md:block" /> neighborhood.
                    </p>
                </div>

                <div className="w-full space-y-12">
            
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-white border border-gray-150 rounded-3xl shadow-xl shadow-gray-100/50">
                        {/* 1. Province */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-red-600 px-1">1. Province / State</label>
                            <div className="relative">
                                <select 
                                    value={selectedProvince}
                                    onChange={handleProvinceChange}
                                    className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 text-gray-800 appearance-none focus:border-red-500 focus:bg-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    <option value="">Choose Province...</option>
                                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none"><path d="m9 18 6-6-6-6"></path></svg>
                            </div>
                        </div>

                        {/* 2. Region */}
                        <div className={`space-y-2 transition-all duration-300 ${!selectedProvince ? 'opacity-50 pointer-events-none' : ''}`}>
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-red-600 px-1">2. Region / District</label>
                            <div className="relative">
                                <select 
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                    disabled={!selectedProvince}
                                    className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 text-gray-800 appearance-none focus:border-red-500 focus:bg-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <option value="">Choose Region...</option>
                                    {availableDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none"><path d="m9 18 6-6-6-6"></path></svg>
                            </div>
                        </div>

                        {/* 3. City */}
                        <div className={`space-y-2 transition-all duration-300 ${!selectedDistrict ? 'opacity-50 pointer-events-none' : ''}`}>
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-red-600 px-1">3. City / Town</label>
                            <div className="relative">
                                <select 
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    disabled={!selectedDistrict}
                                    className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 text-gray-800 appearance-none focus:border-red-500 focus:bg-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <option value="">Choose City...</option>
                                    {availableCities.map(c => <option key={c.id} value={c.id}>{c.location_name}</option>)}
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none"><path d="m9 18 6-6-6-6"></path></svg>
                            </div>
                        </div>

                        {/* 4. Coverage Status */}
                        <div className="flex items-end">
                            <div className="w-full bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-600 rounded-lg text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-black leading-none mb-1">Coverage Status</span>
                                        <span className="block text-sm font-extrabold text-gray-800 leading-none">
                                            {targetCity ? `${services.length} Moving Services` : 'Awaiting Input'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Empty States */}
                    {!targetCity && !loading && (
                        <div className="bg-white rounded-3xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin text-red-600"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Select your destination</h3>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Choose Province, Region and City to view local services</p>
                        </div>
                    )}

                    {loading && (
                        <div className="bg-white rounded-3xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Loading Directory</h3>
                        </div>
                    )}

                    {/* Services Grid */}
                    {!loading && targetCity && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => {
                                const citySlug = targetCity.location_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                const url = `/location/${service.slug}-in-${citySlug}`;
                                
                                return (
                                    <Link key={index} className="group relative bg-white border border-gray-100 hover:border-red-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden" href={url}>
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/50 rounded-bl-[60px] -mr-6 -mt-6 group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>
                                        <div className="relative z-10 space-y-5">
                                            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl w-fit group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                                                <div className="group-hover:scale-110 transition-transform duration-300">
                                                    {service.icon ? (
                                                        <div dangerouslySetInnerHTML={{ __html: service.icon }} className="h-6 w-6" />
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-6 w-6"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-extrabold text-gray-900 text-xl tracking-tight leading-snug group-hover:text-red-600 transition-colors">{service.title || service.name}</h3>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Available in {targetCity.location_name}</p>
                                            </div>
                                            <p className="text-xs text-gray-500 font-semibold leading-relaxed line-clamp-3">{service.short_description || `Professional ${service.title || service.name} services by Galaxy Movers.`}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-50 relative z-10">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">Book Moving Crew <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span>
                                            <div className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"></path></svg>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>

            <Footer />
        </main>
    );
}
