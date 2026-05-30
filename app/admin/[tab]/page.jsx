// src/AdminDashboard/AdminDashboard.jsx
"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiMenu, FiCode, FiTerminal, FiSave, FiMessageSquare, FiFileText, FiMapPin, FiTrendingUp, FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

import QuotesManagement from '@/src/AdminDashboard/uotesManagement';
import LocationManagement from '@/src/AdminDashboard/LocationManagement';
import BlogManagement from '@/src/AdminDashboard/BlogManagement';
import ServiceManagement from '@/src/AdminDashboard/ServiceManagement';
import AdminSidebar from '@/src/AdminDashboard/AdminSidebar';

const standardPages = [
    { id: 'home', path: '/', label: 'Home Page' },
    { id: 'about', path: '/about', label: 'About Page' },
    { id: 'faq', path: '/faqs', label: 'FAQ Page' },
    { id: 'blogs', path: '/blogs', label: 'Blogs List Page' },
    { id: 'house-moving', path: '/house-moving', label: 'House Moving Page' },
    { id: 'manpower', path: '/manpower', label: 'Manpower Page' },
    { id: 'storage-services', path: '/StorageServices', label: 'Storage Services Page' },
    { id: 'insurance', path: '/Insurance', label: 'Insurance Page' },
    { id: 'license', path: '/License', label: 'License Page' },
    { id: 'licensee', path: '/licensee', label: 'Licensee Page' },
    { id: 'insurance-policy-claims', path: '/insurance-and-policy-claims', label: 'Insurance Policy Claims Page' }
];

const getPagePath = (id) => {
    if (id === 'global-scripts') return 'global';
    const found = standardPages.find(p => p.id === id);
    return found ? found.path : id;
};

const AdminDashboardContent = () => {
    const router = useRouter();

    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Default to 'dashboard' if for some reason tab is missing, but with Next.js dynamic routing it should be there.
    const selectedTab = params?.tab || 'dashboard';

    const setSelectedTab = (tab) => {
        router.push(`/admin/${tab}`);
    };
    const [content, setContent] = useState({});

    const [heroForm, setHeroForm] = useState({
        heroTitle: '',
        heroSubtitle: '',
        heroCta: 'GET QUOTE',
        heroPhone: '(306) 450 0708',
    });

    const [seoForm, setSeoForm] = useState({
        homeTitle: 'Galaxy Movers Regina',
        homeDescription: 'Professional moving services in Regina, Saskatchewan.',
    });

    const [aboutForm, setAboutForm] = useState({
        heroTitle: 'About Galaxy Movers Regina',
        heroSubtitle: 'Your Trusted Moving Partner Since 2012',
        storyTitle: 'Our Story',
        storyText:
            'Galaxy Movers Regina was founded in 2012 with a simple mission — to provide stress-free, reliable, and professional moving services.',
        missionTitle: 'Our Mission',
        missionText:
            'To deliver exceptional moving experiences with honesty, care, and professionalism.',
        whyTitle: 'Why Choose Us?',
        whyPoint1: 'Over 12+ Years of Experience',
        whyPoint2: 'Fully Licensed & Insured',
        whyPoint3: 'Trained & Professional Movers',
        imageUrl:
            'https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize,to_auto,s_webp:avif/galaxymoversregina.ca/wp-content/uploads/2025/08/Images.webp',
    });

    const [aboutSeoForm, setAboutSeoForm] = useState({
        aboutTitle: 'About Galaxy Movers Regina | Trusted Local Movers',
        aboutDescription:
            'Galaxy Movers Regina delivers reliable moving services.',
    });

    const [aboutShowForm, setAboutShowForm] = useState(false);

    // NEW STATES FOR SEO PAGE MANAGER & GLOBAL SCRIPTS
    const [selectedSeoPage, setSelectedSeoPage] = useState('home');
    const [seoCurrentPage, setSeoCurrentPage] = useState(1);
    const [seoSearchQuery, setSeoSearchQuery] = useState('');
    const [seoShowForm, setSeoShowForm] = useState(false);
    const SEO_ITEMS_PER_PAGE = 10;

    const [seoManagerForm, setSeoManagerForm] = useState({
        title: '',
        description: '',
        keywords: '',
        canonical_url: '',
        og_title: '',
        og_description: '',
        og_image: '',
        header: '',
        footer: '',
        faqs: [],
    });

    const [customSeoPages, setCustomSeoPages] = useState([]);

    const fetchSeoPages = async () => {
        try {
            const res = await axios.get('/api/admin/seo');
            if (res.data.success && res.data.seos) {
                setCustomSeoPages(res.data.seos);
            }
        } catch (error) {
            console.error('Failed to fetch SEO pages', error);
        }
    };

    const getMergedSeoPages = () => {
        const list = [
            { id: 'global-scripts', path: 'global', label: 'Global Scripts (Header & Footer)', isStandard: true },
            ...standardPages.map(p => ({ ...p, isStandard: true }))
        ];
        const seenPaths = new Set(list.map(p => p.path));

        customSeoPages.forEach(seo => {
            if (seo.page_path === 'global') return;
            if (!seenPaths.has(seo.page_path)) {
                list.push({
                    id: seo.page_path,
                    path: seo.page_path,
                    label: `Custom Page: ${seo.page_path}`,
                    isStandard: false
                });
            }
        });
        return list;
    };


    // Helper handlers for seoManagerForm FAQs
    const addSeoManagerFaq = () => {
        setSeoManagerForm(prev => ({
            ...prev,
            faqs: [...(prev.faqs || []), { q: '', a: '' }]
        }));
    };
    const updateSeoManagerFaq = (index, field, value) => {
        const newFaqs = [...(seoManagerForm.faqs || [])];
        newFaqs[index][field] = value;
        setSeoManagerForm(prev => ({
            ...prev,
            faqs: newFaqs
        }));
    };
    const removeSeoManagerFaq = (index) => {
        const newFaqs = [...(seoManagerForm.faqs || [])];
        newFaqs.splice(index, 1);
        setSeoManagerForm(prev => ({
            ...prev,
            faqs: newFaqs
        }));
    };

    const [saving, setSaving] = useState(false);

    const blogRef = useRef(null);
    const [blogShowForm, setBlogShowForm] = useState(false);

    const serviceRef = useRef(null);
    const [serviceShowForm, setServiceShowForm] = useState(false);

    const locationRef = useRef(null);
    const [locationState, setLocationState] = useState({ showForm: false, activeTab: 'provinces' });

    useEffect(() => {
        const admin = localStorage.getItem('admin');

        if (!admin) {
            router.push('/admin/login');
            return;
        }

        setLoading(false);
        loadPageContent();
        fetchSeoPages();
    }, [router]);

    const loadPageContent = async () => {
        try {
            const [homeResponse, aboutResponse] =
                await Promise.all([
                    axios.get('/api/content/page/home'),
                    axios.get('/api/content/page/about'),
                ]);

            if (homeResponse.data.success) {
                const pageContent = homeResponse.data.content || {};
                setContent((prev) => ({
                    ...prev,
                    home: pageContent,
                }));

                if (pageContent.hero) {
                    setHeroForm({
                        heroTitle: pageContent.hero.heroTitle || '',
                        heroSubtitle: pageContent.hero.heroSubtitle || '',
                        heroCta: pageContent.hero.heroCta || 'GET QUOTE',
                        heroPhone: pageContent.hero.heroPhone || '(306) 450 0708',
                    });
                }

                if (pageContent.seo) {
                    setSeoForm({
                        homeTitle: pageContent.seo.homeTitle || 'Galaxy Movers Regina',
                        homeDescription: pageContent.seo.homeDescription || '',
                    });
                }
            }

            if (aboutResponse.data.success) {
                const aboutContent = aboutResponse.data.content || {};
                setContent((prev) => ({
                    ...prev,
                    about: aboutContent,
                }));

                if (aboutContent.about) {
                    setAboutForm({
                        heroTitle: aboutContent.about.heroTitle || '',
                        heroSubtitle: aboutContent.about.heroSubtitle || '',
                        storyTitle: aboutContent.about.storyTitle || '',
                        storyText: aboutContent.about.storyText || '',
                        missionTitle: aboutContent.about.missionTitle || '',
                        missionText: aboutContent.about.missionText || '',
                        whyTitle: aboutContent.about.whyTitle || '',
                        whyPoint1: aboutContent.about.whyPoint1 || '',
                        whyPoint2: aboutContent.about.whyPoint2 || '',
                        whyPoint3: aboutContent.about.whyPoint3 || '',
                        imageUrl: aboutContent.about.imageUrl || '',
                    });
                }

                if (aboutContent.seo) {
                    setAboutSeoForm({
                        aboutTitle: aboutContent.seo.aboutTitle || '',
                        aboutDescription: aboutContent.seo.aboutDescription || '',
                    });
                }
            }

            // Load Global scripts and dynamic SEO on initialization
            loadPageSeo('home');
        } catch (error) {
            console.error('Failed to load content', error);
        }
    };

    // HERO
    const handleHeroChange = (e) => {
        setHeroForm({
            ...heroForm,
            [e.target.name]: e.target.value,
        });
    };

    // SEO
    const handleSeoChange = (e) => {
        setSeoForm({
            ...seoForm,
            [e.target.name]: e.target.value,
        });
    };

    // ABOUT
    const handleAboutChange = (e) => {
        setAboutForm({
            ...aboutForm,
            [e.target.name]: e.target.value,
        });
    };

    // ABOUT SEO
    const handleAboutSeoChange = (e) => {
        setAboutSeoForm({
            ...aboutSeoForm,
            [e.target.name]: e.target.value,
        });
    };

    // SAVE HERO
    const saveHeroContent = async () => {
        setSaving(true);
        try {
            await axios.put('/api/content/page/home/hero', heroForm);
            toast.success('Hero content saved successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save hero content');
        } finally {
            setSaving(false);
        }
    };

    // SAVE SEO
    const saveSeoContent = async () => {
        setSaving(true);
        try {
            await axios.put('/api/content/page/home/seo', seoForm);
            toast.success('SEO content saved successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save SEO content');
        } finally {
            setSaving(false);
        }
    };

    // SAVE ABOUT
    const saveAboutContent = async () => {
        setSaving(true);
        try {
            await axios.put('/api/content/page/about/content', aboutForm);
            toast.success('About page content saved successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save about page content');
        } finally {
            setSaving(false);
        }
    };

    // SAVE ABOUT SEO
    const saveAboutSeoContent = async () => {
        setSaving(true);
        try {
            await axios.put('/api/content/page/about/seo', aboutSeoForm);
            toast.success('About page SEO saved successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save about page SEO');
        } finally {
            setSaving(false);
        }
    };



    // LOAD PAGE SEO
    const loadPageSeo = async (pageId) => {
        try {
            if (pageId === 'global-scripts') {
                const res = await axios.get('/api/admin/seo?page_path=global');
                if (res.data.success && res.data.seo) {
                    const seo = res.data.seo;
                    setSeoManagerForm({
                        title: '',
                        description: '',
                        keywords: '',
                        canonical_url: '',
                        og_title: '',
                        og_description: '',
                        og_image: '',
                        header: seo.header_scripts || '',
                        footer: seo.footer_scripts || '',
                        faqs: [],
                    });
                } else {
                    const fallbackRes = await axios.get('/api/content/page/global');
                    if (fallbackRes.data.success) {
                        const scripts = fallbackRes.data.content?.scripts || {};
                        setSeoManagerForm({
                            title: '',
                            description: '',
                            keywords: '',
                            canonical_url: '',
                            og_title: '',
                            og_description: '',
                            og_image: '',
                            header: scripts.header || '',
                            footer: scripts.footer || '',
                            faqs: [],
                        });
                    }
                }
                return;
            }

            const path = getPagePath(pageId);
            const res = await axios.get(`/api/admin/seo?page_path=${encodeURIComponent(path)}`);
            if (res.data.success && res.data.seo) {
                const seo = res.data.seo;
                let parsedFaqs = [];
                if (seo.faqs) {
                    try {
                        parsedFaqs = typeof seo.faqs === 'string' ? JSON.parse(seo.faqs) : seo.faqs;
                    } catch (e) {
                        parsedFaqs = [];
                    }
                }
                setSeoManagerForm({
                    title: seo.title || '',
                    description: seo.description || '',
                    keywords: seo.keywords || '',
                    canonical_url: seo.canonical_url || '',
                    og_title: seo.og_title || '',
                    og_description: seo.og_description || '',
                    og_image: seo.og_image || '',
                    header: seo.header_scripts || '',
                    footer: seo.footer_scripts || '',
                    faqs: Array.isArray(parsedFaqs) ? parsedFaqs : [],
                });
            } else {
                const standardPage = standardPages.find(p => p.id === pageId);
                if (standardPage) {
                    const fallbackRes = await axios.get(`/api/content/page/${pageId}`);
                    if (fallbackRes.data.success) {
                        const seo = fallbackRes.data.content?.seo || {};
                        let parsedFaqs = [];
                        if (seo.faqs) {
                            try {
                                parsedFaqs = typeof seo.faqs === 'string' ? JSON.parse(seo.faqs) : seo.faqs;
                            } catch (e) {
                                parsedFaqs = [];
                            }
                        }
                        setSeoManagerForm({
                            title: seo.title || '',
                            description: seo.description || '',
                            keywords: seo.keywords || '',
                            canonical_url: '',
                            og_title: '',
                            og_description: '',
                            og_image: '',
                            header: '',
                            footer: '',
                            faqs: Array.isArray(parsedFaqs) ? parsedFaqs : [],
                        });
                    }
                } else {
                    setSeoManagerForm({
                        title: '',
                        description: '',
                        keywords: '',
                        canonical_url: '',
                        og_title: '',
                        og_description: '',
                        og_image: '',
                        header: '',
                        footer: '',
                        faqs: [],
                    });
                }
            }
        } catch (error) {
            console.error("Failed to load page SEO", error);
        }
    };

    const handleSeoPageChange = (e) => {
        const page = e.target.value;
        setSelectedSeoPage(page);
        loadPageSeo(page);
    };

    // SAVE PAGE SEO
    const savePageSeo = async () => {
        setSaving(true);
        try {
            if (selectedSeoPage === 'global-scripts') {
                await axios.put(`/api/content/page/global/scripts`, {
                    header: seoManagerForm.header || '',
                    footer: seoManagerForm.footer || '',
                });
                toast.success('Global scripts saved successfully');
            } else {
                const isStandard = standardPages.some(p => p.id === selectedSeoPage);
                const path = getPagePath(selectedSeoPage);
                
                if (isStandard) {
                    await axios.put(`/api/content/page/${selectedSeoPage}/seo`, {
                        title: seoManagerForm.title || '',
                        description: seoManagerForm.description || '',
                        keywords: seoManagerForm.keywords || '',
                        faqs: seoManagerForm.faqs || [],
                    });
                }
                
                await axios.post(`/api/admin/seo`, {
                    page_path: path,
                    title: seoManagerForm.title || '',
                    description: seoManagerForm.description || '',
                    keywords: seoManagerForm.keywords || '',
                    canonical_url: seoManagerForm.canonical_url || '',
                    og_title: seoManagerForm.og_title || '',
                    og_description: seoManagerForm.og_description || '',
                    og_image: seoManagerForm.og_image || '',
                    header_scripts: seoManagerForm.header || '',
                    footer_scripts: seoManagerForm.footer || '',
                    faqs: seoManagerForm.faqs || [],
                });
                
                toast.success(`SEO metadata for ${selectedSeoPage} saved successfully`);
            }
            fetchSeoPages();
        } catch (error) {
            console.error(error);
            toast.error(`Failed to save settings`);
        } finally {
            setSaving(false);
        }
    };

    // CLEAR / DELETE PAGE SEO
    const clearPageSeo = async (pageId) => {
        const isStandard = standardPages.some(p => p.id === pageId);

        if (!isStandard && pageId !== 'global-scripts') {
            const result = await Swal.fire({
                title: 'Delete SEO Configuration?',
                html: `Are you sure you want to delete the SEO configuration for <code>${pageId}</code>? This cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#CC0336',
                cancelButtonColor: '#06056C',
                confirmButtonText: 'Yes, delete it',
                cancelButtonText: 'Cancel',
            });
            if (!result.isConfirmed) return;
            try {
                await axios.delete(`/api/admin/seo?page_path=${encodeURIComponent(pageId)}`);
                toast.success(`SEO deleted for ${pageId}`);
                fetchSeoPages();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete SEO configuration');
            }
            return;
        }

        const result = await Swal.fire({
            title: 'Clear SEO Metadata?',
            html: `This will reset the <b>title</b>, <b>description</b>, and <b>keywords</b> for <code>${pageId}</code> to empty.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#CC0336',
            cancelButtonColor: '#06056C',
            confirmButtonText: 'Yes, clear it',
            cancelButtonText: 'Cancel',
        });
        if (!result.isConfirmed) return;
        try {
            await axios.put(`/api/content/page/${pageId}/seo`, { title: '', description: '', keywords: '' });
            toast.success(`SEO cleared for ${pageId}`);
            fetchSeoPages();
        } catch (error) {
            console.error(error);
            toast.error('Failed to clear SEO metadata');
        }
    };

    // LOADING
    if (loading) {
        return (
            <div
                style={{
                    padding: '40px',
                    textAlign: 'center',
                }}
            >
                Loading admin dashboard...
            </div>
        );
    }

    // RENDER PANEL
    const renderPanel = () => {
        switch (selectedTab) {
            case 'quotes':
                return <QuotesManagement />;

            case 'locations':
                return <LocationManagement ref={locationRef} onFormStateChange={setLocationState} />;

            case 'blogs':
                return <BlogManagement ref={blogRef} onFormStateChange={setBlogShowForm} />;

            case 'services':
                return <ServiceManagement ref={serviceRef} onFormStateChange={setServiceShowForm} />;



            case 'seo': {
                const mergedList = getMergedSeoPages();
                const filteredPagesList = mergedList.filter(page => {
                    const slug = page.path;
                    return page.label.toLowerCase().includes(seoSearchQuery.toLowerCase()) ||
                        slug.toLowerCase().includes(seoSearchQuery.toLowerCase());
                });

                const totalPages = Math.ceil(filteredPagesList.length / SEO_ITEMS_PER_PAGE);
                const currentPages = filteredPagesList.slice((seoCurrentPage - 1) * SEO_ITEMS_PER_PAGE, seoCurrentPage * SEO_ITEMS_PER_PAGE);

                return (
                    <div className="flex flex-col gap-6 w-full">
                        <div>


                            {seoShowForm && (
                                <div className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col gap-6 mb-8 rounded-xl shadow-sm">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize">Edit: {selectedSeoPage.replace(/-/g, ' ')}</h2>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">Select Item to Manage</label>
                                        <select
                                            value={selectedSeoPage}
                                            onChange={handleSeoPageChange}
                                            className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                        >
                                            {getMergedSeoPages().map(page => (
                                                <option key={page.id} value={page.id}>{page.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedSeoPage === 'global-scripts' ? (
                                        <>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-gray-900">Global Header Scripts (inside &lt;head&gt; / top of &lt;body&gt;)</label>
                                                <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-slate-800 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg font-mono text-xs"
                                                    value={seoManagerForm.header || ''}
                                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, header: e.target.value })}
                                                    placeholder="e.g. <!-- Google Tag Manager --> <script>...</script>"
                                                    rows={8}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-gray-900">Global Footer Scripts (before closing &lt;/body&gt;)</label>
                                                <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-slate-800 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg font-mono text-xs"
                                                    value={seoManagerForm.footer || ''}
                                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, footer: e.target.value })}
                                                    placeholder="e.g. <script src='https://js.hs-scripts.com/...js'></script>"
                                                    rows={8}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-gray-900">Meta Title</label>
                                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                                    value={seoManagerForm.title}
                                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, title: e.target.value })}
                                                    placeholder="Enter SEO Meta Title..."
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-gray-900">Meta Description</label>
                                                <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                                    value={seoManagerForm.description}
                                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, description: e.target.value })}
                                                    placeholder="Enter SEO Meta Description..."
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-gray-900">Meta Keywords</label>
                                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                                    value={seoManagerForm.keywords}
                                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, keywords: e.target.value })}
                                                    placeholder="Enter SEO Meta Keywords (comma separated)..."
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-gray-900">Canonical URL</label>
                                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                                    value={seoManagerForm.canonical_url || ''}
                                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, canonical_url: e.target.value })}
                                                    placeholder="e.g. https://galaxymovers.ca/about"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-sm font-semibold text-gray-900">OG Title</label>
                                                    <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                                        value={seoManagerForm.og_title || ''}
                                                        onChange={(e) => setSeoManagerForm({ ...seoManagerForm, og_title: e.target.value })}
                                                        placeholder="Custom Social Title"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-sm font-semibold text-gray-900">OG Image URL</label>
                                                    <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                                        value={seoManagerForm.og_image || ''}
                                                        onChange={(e) => setSeoManagerForm({ ...seoManagerForm, og_image: e.target.value })}
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-gray-900">OG Description</label>
                                                <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                                    value={seoManagerForm.og_description || ''}
                                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, og_description: e.target.value })}
                                                    placeholder="Custom Social Description"
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-gray-900">Page-Specific Header Scripts (inside &lt;head&gt;)</label>
                                                <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg font-mono text-xs"
                                                    value={seoManagerForm.header || ''}
                                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, header: e.target.value })}
                                                    placeholder="e.g. <script>...</script>"
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-gray-900">Page-Specific Footer Scripts (before &lt;/body&gt;)</label>
                                                <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg font-mono text-xs"
                                                    value={seoManagerForm.footer || ''}
                                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, footer: e.target.value })}
                                                    placeholder="e.g. <script>...</script>"
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
                                        <h3 className="text-lg font-bold text-gray-900">Dynamic FAQ Schema Builder</h3>
                                        {seoManagerForm.faqs && seoManagerForm.faqs.map((faq, idx) => (
                                            <div key={idx} className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                                                <button onClick={() => removeSeoManagerFaq(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1">
                                                    <FiTrash2 size={16} />
                                                </button>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-semibold text-gray-700">Question</label>
                                                    <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg" value={faq.q} onChange={(e) => updateSeoManagerFaq(idx, 'q', e.target.value)} placeholder="e.g. Do you handle piano moves?" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-semibold text-gray-700">Answer text</label>
                                                    <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg" value={faq.a} onChange={(e) => updateSeoManagerFaq(idx, 'a', e.target.value)} rows={2} placeholder="Answer text..." />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={addSeoManagerFaq} className="w-fit text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                            <FiPlus /> Add FAQ
                                        </button>
                                    </div>
                                        </>
                                    )}

                                    <div className="flex gap-4 mt-2">
                                        <button
                                            className="bg-[#06056C] hover:bg-blue-900 text-white font-semibold py-3 px-6 transition-colors shadow-sm rounded-lg"
                                            onClick={() => { savePageSeo(); setSeoShowForm(false); }}
                                            disabled={saving}
                                        >
                                            Save Settings
                                        </button>
                                        <button
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 transition-colors border border-gray-200 shadow-sm rounded-lg"
                                            onClick={() => setSeoShowForm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!seoShowForm && (
                                <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                                    <div className="p-6 md:p-8 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-semibold text-gray-500 hidden md:block">
                                                {filteredPagesList.length} found ({mergedList.length} total)
                                            </span>
                                        </div>
                                        <div className="relative w-full sm:w-80">
                                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Search pages..."
                                                value={seoSearchQuery}
                                                onChange={(e) => {
                                                    setSeoSearchQuery(e.target.value);
                                                    setSeoCurrentPage(1);
                                                }}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                                                    <th className="py-4 px-6 font-semibold w-1/3">Page Name</th>
                                                    <th className="py-4 px-6 font-semibold w-1/3">URL Slug</th>
                                                    <th className="py-4 px-6 font-semibold text-right w-1/3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPages.map((page, idx) => (
                                                    <tr key={page.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                        <td className="py-4 px-6 font-medium text-gray-900">
                                                            {page.label}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                                                {page.id === 'global-scripts' ? 'Global (All Pages)' : page.path}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="flex justify-end items-center gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedSeoPage(page.id);
                                                                        loadPageSeo(page.id);
                                                                        setSeoShowForm(true);
                                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                    }}
                                                                    title="Edit SEO"
                                                                    className="bg-white border border-gray-200 hover:border-[#06056C] hover:bg-[#06056C] hover:text-white text-[#06056C] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"
                                                                >
                                                                    <FiEdit2 size={15} />
                                                                </button>
                                                                <button
                                                                    onClick={() => clearPageSeo(page.id)}
                                                                    title="Clear SEO"
                                                                    className="bg-white border border-gray-200 hover:border-[#CC0336] hover:bg-[#CC0336] hover:text-white text-[#CC0336] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"
                                                                >
                                                                    <FiTrash2 size={15} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {currentPages.length === 0 && <div className="p-10 text-center text-gray-500">No pages found.</div>}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                                            <span className="text-sm text-gray-500">
                                                Showing <span className="font-medium">{filteredPagesList.length === 0 ? 0 : (seoCurrentPage - 1) * SEO_ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(seoCurrentPage * SEO_ITEMS_PER_PAGE, filteredPagesList.length)}</span> of <span className="font-medium">{filteredPagesList.length}</span> pages
                                            </span>
                                            <div className="flex gap-2">
                                                <button disabled={seoCurrentPage === 1} onClick={() => setSeoCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                                                <button disabled={seoCurrentPage === totalPages || totalPages === 0} onClick={() => setSeoCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            case 'dashboard':
                return (
                    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FiTrendingUp className="text-[#CC0336]" /> Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <button onClick={() => setSelectedTab('quotes')} className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-[#06056C]/30 hover:shadow-xl hover:shadow-[#06056C]/5 transition-all duration-300 flex flex-col items-center justify-center gap-5 text-center group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#06056C]/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150 origin-top-right"></div>
                                    <div className="w-16 h-16 bg-[#06056C]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#06056C] group-hover:text-white transition-all duration-300 text-[#06056C]">
                                        <FiMessageSquare size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 mb-2">Review Quotes</h3>
                                        <p className="text-xs text-gray-500 font-medium">Manage and respond to new customer inquiries instantly.</p>
                                    </div>
                                </button>

                                <button onClick={() => setSelectedTab('blogs')} className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-[#CC0336]/30 hover:shadow-xl hover:shadow-[#CC0336]/5 transition-all duration-300 flex flex-col items-center justify-center gap-5 text-center group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CC0336]/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150 origin-top-right"></div>
                                    <div className="w-16 h-16 bg-[#CC0336]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#CC0336] group-hover:text-white transition-all duration-300 text-[#CC0336]">
                                        <FiFileText size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 mb-2">Write a Blog Post</h3>
                                        <p className="text-xs text-gray-500 font-medium">Create and publish new content for your audience.</p>
                                    </div>
                                </button>

                                <button onClick={() => setSelectedTab('locations')} className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 flex flex-col items-center justify-center gap-5 text-center group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150 origin-top-right"></div>
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 text-emerald-600">
                                        <FiMapPin size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 mb-2">Update Locations</h3>
                                        <p className="text-xs text-gray-500 font-medium">Manage service coverage areas and regional settings.</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const headerData = {
        dashboard: { title: 'Admin Dashboard', desc: 'Overview of your admin panel.' },
        quotes: { title: 'Quotes Management', desc: 'View and manage all incoming quote requests from customers.' },
        locations: { title: 'Manage States, Districts & Cities', desc: 'Create, edit, and organize Provinces (States), Regions (Districts) and Cities (Locations) to configure dynamic catchment pages.' },
        blogs: { title: 'Blog Posts', desc: 'Create and manage your blog posts.' },
        about: { title: 'About Page', desc: 'Edit the About Us page details.' },
        services: { title: 'Services Management', desc: 'Create and manage the services offered by Galaxy Movers Regina.' },
        seo: { title: 'SEO Manager', desc: 'Manage your website SEO metadata.' },
    };
    const currentHeader = headerData[selectedTab] || headerData['dashboard'];

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* SIDEBAR */}
            <AdminSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* MAIN */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-5 py-4 md:px-8 md:py-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden bg-transparent border-none cursor-pointer text-gray-900" onClick={() => setIsSidebarOpen(true)}>
                            <FiMenu size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 m-0 leading-tight">{currentHeader.title}</h1>
                            <p className="text-sm text-gray-500 m-0 mt-1">{currentHeader.desc}</p>
                        </div>
                    </div>
                    {selectedTab === 'seo' && (
                        <button onClick={() => router.push('/admin/seo/new')} className="bg-[#06056C] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm">
                            <span className="text-lg leading-none">+</span> Add Page SEO
                        </button>
                    )}

                    {selectedTab === 'blogs' && !blogShowForm && (
                        <button
                            onClick={() => blogRef.current?.openNewBlog()}
                            className="bg-[#06056C] hover:bg-blue-900 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <FiPlus /> Add Blog
                        </button>
                    )}
                    {selectedTab === 'services' && !serviceShowForm && (
                        <button 
                            onClick={() => serviceRef.current?.openNewService()} 
                            className="bg-[#06056C] hover:bg-blue-900 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <FiPlus /> Create Service
                        </button>
                    )}
                    {selectedTab === 'locations' && !locationState.showForm && (
                        <button 
                            onClick={() => locationRef.current?.openNew()} 
                            className="bg-[#06056C] hover:bg-blue-900 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <FiPlus /> {locationState.activeTab === 'provinces' ? 'Add Province' : locationState.activeTab === 'districts' ? 'Add Region' : locationState.activeTab === 'service_locations' ? 'Add Service Location' : 'Add City'}
                        </button>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {renderPanel()}
                </div>
            </main>
        </div>
    );
};

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>}>
            <AdminDashboardContent />
        </Suspense>
    );
}