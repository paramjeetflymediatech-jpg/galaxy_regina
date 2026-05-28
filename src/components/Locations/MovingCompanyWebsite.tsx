"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Footer from "../Footer/Footer";

const MovingCompanyWebsite = () => {
    const params = useParams();
    const slug = params.slug as string;

    const [locationData, setLocationData] = useState<any>(null);
    const [serviceData, setServiceData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // FAQ state
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        if (!slug) return;
        fetchLocation();
    }, [slug]);

    const fetchLocation = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Check if it's a compound slug like antique-and-art-movers-in-barrhead
            let locationSlug = slug;
            let serviceSlug = null;
            
            if (slug && slug.includes('-in-')) {
                const parts = slug.split('-in-');
                serviceSlug = parts[0];
                locationSlug = parts[1];
            }

            const [locationRes, servicesRes] = await Promise.all([
                axios.get(`/api/locations/${locationSlug}${serviceSlug ? `?service=${serviceSlug}` : ''}`),
                serviceSlug ? axios.get('/api/services') : Promise.resolve({ data: { services: [] } })
            ]);

            if (locationRes.data.success) {
                const locData = locationRes.data.location || locationRes.data.content;
                if (locData.Services && locData.Services.length > 0) {
                    const serviceLocationData = locData.Services[0].ServiceLocation;
                    if (serviceLocationData) {
                        if (serviceLocationData.content) locData.service_location_content = serviceLocationData.content;
                        if (serviceLocationData.description) locData.service_location_description = serviceLocationData.description;
                        if (serviceLocationData.faqs) {
                            try { locData.faqs = JSON.parse(serviceLocationData.faqs); } catch(e) {}
                        }
                    }
                }
                setLocationData(locData);
            } else {
                setError("Location data not found");
            }
            
            if (serviceSlug && servicesRes.data.services) {
                const matchedService = servicesRes.data.services.find((s: any) => s.slug === serviceSlug);
                if (matchedService) {
                    setServiceData(matchedService);
                }
            }

        } catch (err: any) {
            console.error(err);
            setError("Failed to load location content");
        } finally {
            setLoading(false);
        }
    };
    console.log(serviceData);
    // console.log(locationData);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    
    if (error || !locationData) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Location Not Found"}</h2>
            <Link href="/location" className="text-red-600 hover:underline">Back to Locations</Link>
        </div>
    );

    // Try to parse service name from serviceData, hero_title or default
    const titleText = serviceData?.title || locationData.hero_title || "Moving Services";
    const locName = locationData.location_name || "Canada";
    const displayContent = locationData.service_location_content || serviceData?.content || locationData.content || '<p>Details are currently being updated.</p>';
    const displaySubtitle = locationData.service_location_description || serviceData?.short_description || locationData.hero_subtitle || `Trust Galaxy Movers for secure, professional transport. Your precious items are safe with our Local Moving Company in ${locName}.`;

    let parsedServiceFaqs = null;
    if (serviceData?.faqs) {
        try {
            parsedServiceFaqs = typeof serviceData.faqs === 'string' ? JSON.parse(serviceData.faqs) : serviceData.faqs;
        } catch(e) {}
    }
    
    let displayFaqs = locationData.faqs || parsedServiceFaqs || [
        { q: `What special precautions does Galaxy Movers take for moving in ${locName}?`, a: "Galaxy Movers employs a multi-faceted approach, starting with specialized packing using museum-grade, acid-free materials and custom-built wooden crates for maximum protection. Our vehicles feature air-ride suspension and optional climate control to safeguard against vibrations and environmental changes." },
        { q: `Do you offer insurance for collections moved within ${locName}?`, a: `Yes, Galaxy Movers understands the irreplaceable value of your collections, which is why we offer comprehensive cargo insurance options. While our meticulous packing and handling procedures minimize risks, having insurance provides an additional layer of financial protection and peace of mind against unforeseen circumstances during transit across ${locName}.` }
    ];

    // Ensure it's always an array just in case
    if (!Array.isArray(displayFaqs)) {
        displayFaqs = [];
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <article className="bg-white py-12 lg:py-20 relative overflow-hidden flex-1">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>
                <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-gray-50 rounded-full blur-[100px] pointer-events-none -z-10"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/location" className="inline-flex items-center text-xs font-extrabold text-gray-400 hover:text-red-600 mb-8 transition-colors group cursor-pointer uppercase tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform">
                            <path d="m12 19-7-7 7-7"></path>
                            <path d="M19 12H5"></path>
                        </svg>
                        <span>Locations Finder</span>
                    </Link>

                    <div className="pb-10 mb-12 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="space-y-4 max-w-3xl">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-red-600 font-extrabold text-[10px] uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">Active Moving Center</span>
                                <span className="text-gray-500 font-extrabold text-[10px] uppercase tracking-widest bg-gray-100 py-1.5 px-3.5 rounded-full inline-block">{locName}</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-none">
                                {titleText} <span className="text-red-600">in {locName}</span>
                            </h1>
                            <p className="text-base sm:text-lg text-gray-500 font-medium leading-relaxed">
                                {displaySubtitle}
                            </p>
                        </div>
                        <div className="bg-red-50 text-red-600 p-5 rounded-3xl w-fit border border-red-100 shadow-sm shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-5 w-5">
                                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2 space-y-12">
                            <div className="prose prose-red max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-500 prose-li:text-gray-500 prose-strong:text-gray-900 prose-headings:tracking-tight font-medium">
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight uppercase">Service Details &amp; Overview</h2>
                                <div>
                                    <div className="service-content" dangerouslySetInnerHTML={{ __html: displayContent }} />
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-150 rounded-3xl p-8 space-y-6">
                                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check h-5 w-5 text-red-600">
                                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                                        <path d="m9 12 2 2 4-4"></path>
                                    </svg>
                                    <span>The Galaxy Movers Standard</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white border border-gray-200 rounded-full p-1 text-green-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-3.5 w-3.5"><path d="M20 6 9 17l-5-5"></path></svg>
                                        </div>
                                        <span className="text-xs text-gray-600 font-bold">Licensed, Bonded &amp; Cargo Insured Crews</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white border border-gray-200 rounded-full p-1 text-green-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-3.5 w-3.5"><path d="M20 6 9 17l-5-5"></path></svg>
                                        </div>
                                        <span className="text-xs text-gray-600 font-bold">Double-walled boxes &amp; professional wrap</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white border border-gray-200 rounded-full p-1 text-green-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-3.5 w-3.5"><path d="M20 6 9 17l-5-5"></path></svg>
                                        </div>
                                        <span className="text-xs text-gray-600 font-bold">GPS-enabled transit tracking</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white border border-gray-200 rounded-full p-1 text-green-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-3.5 w-3.5"><path d="M20 6 9 17l-5-5"></path></svg>
                                        </div>
                                        <span className="text-xs text-gray-600 font-bold">Rigid transparent flat-rate pricing</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-gray-100">
                                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-help h-5 w-5 text-red-600 animate-pulse"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
                                    <span>Frequently Asked Questions in {locName}</span>
                                </h3>
                                <div className="space-y-4">
                                    {displayFaqs.map((faq: any, idx: number) => (
                                        <div key={idx} className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200">
                                            <button 
                                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                                type="button" 
                                                className="w-full text-left py-4 px-6 font-extrabold text-gray-800 hover:text-red-600 flex items-center justify-between transition-colors cursor-pointer text-sm sm:text-base"
                                            >
                                                <span className="pr-4">{faq.q}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down h-4.5 w-4.5 stroke-[2.5] text-gray-400 group-hover:text-red-500 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                                                    <path d="m6 9 6 6 6-6"></path>
                                                </svg>
                                            </button>
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96' : 'max-h-0 pointer-events-none'}`}>
                                                <p className="p-6 pt-0 text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">{faq.a}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 sticky top-28">
                            <div className="bg-gray-900 text-white border border-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                                <div className="relative z-10 space-y-6">
                                    <div className="space-y-2">
                                        <span className="text-[10px] text-red-500 uppercase tracking-widest font-black block">Get A Free Quote</span>
                                        <h4 className="text-xl font-black">Book In {locName}</h4>
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed">Arrange your moving date online or talk to our dispatch team for an instant estimate.</p>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-gray-800">
                                        <Link className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-red-600/20 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all" href="/book-appointment">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                                            <span>Book Appointment</span>
                                        </Link>
                                        <a href="tel:403-618-9052" className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone text-red-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                            <span>Call 403-618-9052</span>
                                        </a>
                                    </div>
                                    <ul className="space-y-3 pt-6 border-t border-gray-800 text-[11px] text-gray-400">
                                        <li className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock text-red-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            <span>Open 24/7 for support &amp; scheduling</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-red-500"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                            <span>Galaxymovers21@gmail.com</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin text-red-500"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            <span>Crews stationed locally in {locName}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
            <Footer />
        </div>
    );
};

export default MovingCompanyWebsite;