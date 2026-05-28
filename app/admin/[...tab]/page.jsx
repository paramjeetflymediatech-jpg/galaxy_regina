// src/AdminDashboard/AdminDashboard.jsx
"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiMenu, FiCode, FiTerminal, FiSave, FiMessageSquare, FiFileText, FiMapPin, FiTrendingUp, FiEdit2, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

import QuotesManagement from '@/src/AdminDashboard/uotesManagement';
import LocationManagement from '@/src/AdminDashboard/LocationManagement';
import BlogManagement from '@/src/AdminDashboard/BlogManagement';
import ServiceManagement from '@/src/AdminDashboard/ServiceManagement';
import AdminSidebar from '@/src/AdminDashboard/AdminSidebar';



const AdminDashboardContent = () => {
    const router = useRouter();

    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const tabParam = params?.tab;
    const tabArray = Array.isArray(tabParam) ? tabParam : [tabParam || 'dashboard'];
    const selectedTab = tabArray[0];
    const subTab = tabArray[1];

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

    const [faqs, setFaqs] = useState([]);
    const [faqForm, setFaqForm] = useState({
        question: '',
        answer: '',
    });
    const [editingFaqId, setEditingFaqId] = useState(null);

    // NEW STATES FOR SEO PAGE MANAGER & GLOBAL SCRIPTS
    const [seoCurrentPage, setSeoCurrentPage] = useState(1);
    const [seoSearchQuery, setSeoSearchQuery] = useState('');
    const [selectedSeoPage, setSelectedSeoPage] = useState('home');
    const [seoManagerForm, setSeoManagerForm] = useState({
        title: '',
        description: '',
        keywords: '',
    });
    const [newPageSeoForm, setNewPageSeoForm] = useState({
        page_path: '',
        title: '',
        keywords: '',
        canonical_url: '',
        description: '',
        og_title: '',
        og_image: '',
    });

    const [saving, setSaving] = useState(false);

    const blogRef = useRef(null);
    const [blogShowForm, setBlogShowForm] = useState(false);
    
    const serviceRef = useRef(null);
    const [serviceShowForm, setServiceShowForm] = useState(false);

    const locationRef = useRef(null);
    const [locationState, setLocationState] = useState({ showForm: false, activeTab: 'provinces' });

    const [faqShowForm, setFaqShowForm] = useState(false);

    useEffect(() => {
        const admin = localStorage.getItem('admin');

        if (!admin) {
            router.push('/admin/login');
            return;
        }

        setLoading(false);
        loadPageContent();
    }, [router]);

    const loadPageContent = async () => {
        try {
            const [homeResponse, aboutResponse, faqResponse] =
                await Promise.all([
                    axios.get('/api/content/page/home'),
                    axios.get('/api/content/page/about'),
                    axios.get('/api/admin/faqs'),
                ]);

            if (faqResponse.data.success) {
                setFaqs(faqResponse.data.faqs || []);
            }

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

            // Load dynamic SEO on initialization
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

    // FAQ
    const handleFaqChange = (e) => {
        setFaqForm({
            ...faqForm,
            [e.target.name]: e.target.value,
        });
    };

    const resetFaqForm = () => {
        setFaqForm({
            question: '',
            answer: '',
        });
        setEditingFaqId(null);
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

    // FAQ LOAD
    const loadFaqs = async () => {
        try {
            const response = await axios.get('/api/admin/faqs');
            if (response.data.success) {
                setFaqs(response.data.faqs || []);
            }
        } catch (error) {
            console.error('Failed to load FAQs', error);
        }
    };

    // SAVE FAQ
    const saveFaq = async () => {
        if (!faqForm.question || !faqForm.answer) {
            toast.error('Question and Answer are required');
            return;
        }

        setSaving(true);
        try {
            if (editingFaqId) {
                await axios.put(`/api/admin/faqs/${editingFaqId}`, faqForm);
                toast.success('FAQ updated successfully');
            } else {
                await axios.post('/api/admin/faqs', faqForm);
                toast.success('FAQ added successfully');
            }
            resetFaqForm();
            loadPageContent();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save FAQ');
        } finally {
            setSaving(false);
        }
    };

    // DELETE FAQ
    const deleteFaq = async (id) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            try {
                await axios.delete(`/api/admin/faqs/${id}`);
                toast.success('FAQ deleted successfully');
                loadPageContent();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete FAQ');
            }
        }
    };

    // FAQ LOCK
    const toggleFaqLock = async (id, locked) => {
        try {
            await axios.patch(`/api/admin/faqs/${id}/lock`, { locked });
            setFaqs(
                faqs.map((faq) =>
                    faq.id === id ? { ...faq, locked } : faq
                )
            );
            toast.success(`FAQ ${locked ? 'Locked' : 'Unlocked'} Successfully`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update FAQ lock status');
        }
    };

    // EDIT FAQ
    const editFaq = (faq) => {
        setFaqForm({
            question: faq.question,
            answer: faq.answer,
        });
        setEditingFaqId(faq.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // LOAD PAGE SEO
    const loadPageSeo = async (page) => {
        try {
            const res = await axios.get(`/api/content/page/${page}`);
            if (res.data.success) {
                const seo = res.data.content?.seo || {};
                setSeoManagerForm({
                    title: seo.title || '',
                    description: seo.description || '',
                    keywords: seo.keywords || '',
                });
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
            await axios.put(`/api/content/page/${selectedSeoPage}/seo`, seoManagerForm);
            toast.success(`SEO metadata for ${selectedSeoPage} saved successfully`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to save SEO metadata`);
        } finally {
            setSaving(false);
        }
    };

    // SAVE NEW PAGE PATH SEO
    const saveNewPageSeo = async () => {
        if (!newPageSeoForm.page_path.trim()) {
            toast.error('Page Path is required.');
            return;
        }
        setSaving(true);
        try {
            await axios.post('/api/admin/seo', newPageSeoForm);
            toast.success(`SEO config for ${newPageSeoForm.page_path} saved!`);
            router.push('/admin/seo');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save New Page SEO config');
        } finally {
            setSaving(false);
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

            case 'about':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div className="bg-white p-6 md:p-8 border border-gray-200 flex flex-col gap-4">
                            <h2>About Page Content</h2>
                            <div className="flex flex-col gap-2">
                                <label>Hero Title</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="heroTitle"
                                    value={aboutForm.heroTitle}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Hero Subtitle</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="heroSubtitle"
                                    value={aboutForm.heroSubtitle}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Story Title</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="storyTitle"
                                    value={aboutForm.storyTitle}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Story Text</label>
                                <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="storyText"
                                    value={aboutForm.storyText}
                                    onChange={handleAboutChange}
                                    rows={6}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Mission Title</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="missionTitle"
                                    value={aboutForm.missionTitle}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Mission Text</label>
                                <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="missionText"
                                    value={aboutForm.missionText}
                                    onChange={handleAboutChange}
                                    rows={4}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Why Choose Us Title</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="whyTitle"
                                    value={aboutForm.whyTitle}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Why Point 1</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="whyPoint1"
                                    value={aboutForm.whyPoint1}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Why Point 2</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="whyPoint2"
                                    value={aboutForm.whyPoint2}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Why Point 3</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="whyPoint3"
                                    value={aboutForm.whyPoint3}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>About Image URL</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="imageUrl"
                                    value={aboutForm.imageUrl}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <button
                                className="w-fit px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-colors"
                                onClick={saveAboutContent}
                                disabled={saving}
                            >
                                Save About Content
                            </button>
                        </div>

                        <div className="bg-white p-6 md:p-8 border border-gray-200 flex flex-col gap-4">
                            <h2>About Page SEO</h2>
                            <div className="flex flex-col gap-2">
                                <label>Meta Title</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="aboutTitle"
                                    value={aboutSeoForm.aboutTitle}
                                    onChange={handleAboutSeoChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Meta Description</label>
                                <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    name="aboutDescription"
                                    value={aboutSeoForm.aboutDescription}
                                    onChange={handleAboutSeoChange}
                                    rows={3}
                                />
                            </div>
                            <button
                                className="w-fit px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-colors"
                                onClick={saveAboutSeoContent}
                                disabled={saving}
                            >
                                Save About SEO
                            </button>
                        </div>
                    </div>
                );

            case 'faq':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {faqShowForm && (
                            <div className="bg-white p-6 md:p-8 border border-gray-200 flex flex-col gap-4">
                                <h2>{editingFaqId ? 'Edit FAQ' : 'Add FAQ'}</h2>
                                <div className="flex flex-col gap-2">
                                    <label>Question</label>
                                    <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                        name="question"
                                        value={faqForm.question}
                                        onChange={handleFaqChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label>Answer</label>
                                    <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                        name="answer"
                                        value={faqForm.answer}
                                        onChange={handleFaqChange}
                                        rows={4}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="w-fit px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-colors"
                                        onClick={saveFaq}
                                        disabled={saving}
                                    >
                                        {editingFaqId ? 'Update FAQ' : 'Add FAQ'}
                                    </button>
                                    {editingFaqId && (
                                        <button
                                            className="w-fit px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-colors"
                                            style={{ backgroundColor: '#64748b' }}
                                            onClick={resetFaqForm}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {!faqShowForm && (
                            <div className="bg-white p-6 md:p-8 border border-gray-200 flex flex-col gap-4">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div style={{ width: '300px' }}>
                                        <input
                                            type="text"
                                            placeholder="Search FAQs..."
                                            value={faqSearch}
                                            onChange={handleFaqSearchChange}
                                            className="w-full border border-gray-300 p-2 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                        />
                                    </div>
                                </div>
                                <h2>All FAQs ({faqs.length})</h2>
                                <div className="location-list">
                                    {faqs.map((faq) => (
                                        <div
                                            className="location-item"
                                            key={faq.id}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #f1f5f9' }}
                                        >
                                            <div style={{ flex: 1, paddingRight: '16px' }}>
                                                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#0f172a' }}>{faq.question}</h4>
                                                <p style={{ margin: '0', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>{faq.answer}</p>
                                                <span style={{ fontSize: '11px', display: 'inline-block', marginTop: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: 500, backgroundColor: faq.locked ? '#fee2e2' : '#dcfce7', color: faq.locked ? '#991b1b' : '#15803d' }}>
                                                    {faq.locked ? '🔒 Locked (Internal Only)' : '🌍 Public'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className="btn btn-edit"
                                                    onClick={() => editFaq(faq)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn"
                                                    style={{ backgroundColor: faq.locked ? '#22c55e' : '#f59e0b', color: '#fff' }}
                                                    onClick={() => toggleFaqLock(faq.id, !faq.locked)}
                                                >
                                                    {faq.locked ? 'Unlock' : 'Lock'}
                                                </button>
                                                <button
                                                    className="btn btn-delete"
                                                    onClick={() => deleteFaq(faq.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'seo':
                if (subTab === 'new') {
                    const inputCls = "w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm";
                    return (
                        <div className="bg-white p-6 md:p-8 border border-gray-200 flex flex-col gap-6 rounded-xl shadow-sm mb-12">
                            <div className="border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Configure New Page Path SEO</h2>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-900 text-sm">Page Path (e.g. /blog/tips or /)</label>
                                <input className={inputCls} 
                                    value={newPageSeoForm.page_path} onChange={(e) => setNewPageSeoForm({...newPageSeoForm, page_path: e.target.value})}
                                    placeholder="e.g. /services/packing" 
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-900 text-sm">Meta Title Tag</label>
                                <input className={inputCls} 
                                    value={newPageSeoForm.title} onChange={(e) => setNewPageSeoForm({...newPageSeoForm, title: e.target.value})}
                                    placeholder="Galaxy Movers | Canada's Moving Specialists" 
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-900 text-sm">Meta Keywords (comma separated)</label>
                                <input className={inputCls} 
                                    value={newPageSeoForm.keywords} onChange={(e) => setNewPageSeoForm({...newPageSeoForm, keywords: e.target.value})}
                                    placeholder="moving canada, local movers, packing service" 
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-900 text-sm">Canonical URL (self-referencing or custom tag)</label>
                                <input className={inputCls} 
                                    value={newPageSeoForm.canonical_url} onChange={(e) => setNewPageSeoForm({...newPageSeoForm, canonical_url: e.target.value})}
                                    placeholder="https://galaxymovers.ca/services/packing" 
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-900 text-sm">Meta Description (Search Snippet Description)</label>
                                <textarea className={inputCls} rows={3}
                                    value={newPageSeoForm.description} onChange={(e) => setNewPageSeoForm({...newPageSeoForm, description: e.target.value})}
                                    placeholder="Write a clear, structured summary describing the specific page services to users on search results pages..." 
                                />
                            </div>

                            <div className="border-t border-gray-100 pt-6 flex flex-col gap-6">
                                <h3 className="text-lg font-bold text-gray-900">OpenGraph / Social Media Meta Customizer</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-semibold text-gray-900 text-sm">OG Title</label>
                                        <input className={inputCls} 
                                            value={newPageSeoForm.og_title} onChange={(e) => setNewPageSeoForm({...newPageSeoForm, og_title: e.target.value})}
                                            placeholder="Custom Social Post Title" 
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-semibold text-gray-900 text-sm">OG Image URL</label>
                                        <input className={inputCls} 
                                            value={newPageSeoForm.og_image} onChange={(e) => setNewPageSeoForm({...newPageSeoForm, og_image: e.target.value})}
                                            placeholder="https://example.com/share-image.jpg" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6 flex flex-col gap-6">
                                <h3 className="text-lg font-bold text-gray-900">Raw Analytics/Tracking Script Injections</h3>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-gray-900 text-sm">Header Script Blocks (&lt;head&gt;)<br/><span className="text-xs text-gray-500 font-normal">Raw JS / GTM Blocks</span></label>
                                    <textarea className={`${inputCls} font-mono text-xs`} rows={4}
                                        value={newPageSeoForm.header_scripts} onChange={(e) => setNewPageSeoForm({...newPageSeoForm, header_scripts: e.target.value})}
                                        placeholder="e.g. <!-- Google Tag Manager --> <script>...</script>" 
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-gray-900 text-sm">Footer Script Blocks (Body Footer)<br/><span className="text-xs text-gray-500 font-normal">Chatbots / Styles</span></label>
                                    <textarea className={`${inputCls} font-mono text-xs`} rows={4}
                                        value={newPageSeoForm.footer_scripts} onChange={(e) => setNewPageSeoForm({...newPageSeoForm, footer_scripts: e.target.value})}
                                        placeholder="e.g. <script src='https://cdn.chatbot...'></script>" 
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-2">
                                <button onClick={() => router.push('/admin/seo')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-200">
                                    Cancel
                                </button>
                                <button onClick={saveNewPageSeo} disabled={saving} className="bg-[#06056C] hover:bg-blue-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md disabled:opacity-60">
                                    {saving ? 'Saving...' : 'Save Config'}
                                </button>
                            </div>
                        </div>
                    );
                }
                if (subTab === 'edit') {
                    return (
                        <div className="bg-white p-6 md:p-8 border border-gray-200 flex flex-col gap-4 rounded-xl shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 capitalize">Edit SEO: {selectedSeoPage.replace(/-/g, ' ')}</h2>
                            <p className="text-sm text-gray-500 mb-4">Manage search engine optimization (meta tags) for this page.</p>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Meta Title</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                    value={seoManagerForm.title}
                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, title: e.target.value })}
                                    placeholder="Enter SEO Meta Title..."
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Meta Description</label>
                                <textarea className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                    value={seoManagerForm.description}
                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, description: e.target.value })}
                                    placeholder="Enter SEO Meta Description..."
                                    rows={4}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Meta Keywords</label>
                                <input className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg"
                                    value={seoManagerForm.keywords}
                                    onChange={(e) => setSeoManagerForm({ ...seoManagerForm, keywords: e.target.value })}
                                    placeholder="Enter SEO Meta Keywords (comma separated)..."
                                />
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button
                                    className="w-fit px-8 py-3 bg-[#06056C] hover:bg-blue-900 text-white font-semibold cursor-pointer transition-colors rounded-xl shadow-md"
                                    onClick={savePageSeo}
                                    disabled={saving}
                                >
                                    Save SEO Settings
                                </button>
                                <button onClick={() => router.push('/admin/seo')} className="w-fit px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold cursor-pointer transition-colors rounded-xl border border-gray-300">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    );
                }

                const availablePagesList = [
                    { id: 'home', label: 'Home Page' },
                    { id: 'about', label: 'About Page' },
                    { id: 'faq', label: 'FAQ Page' },
                    { id: 'blogs', label: 'Blogs List Page' },
                    { id: 'house-moving', label: 'House Moving Page' },
                    { id: 'manpower', label: 'Manpower Page' },
                    { id: 'storage-services', label: 'Storage Services Page' },
                    { id: 'insurance', label: 'Insurance Page' },
                    { id: 'license', label: 'License Page' },
                    { id: 'licensee', label: 'Licensee Page' },
                    { id: 'insurance-policy-claims', label: 'Insurance Policy Claims Page' }
                ];

                const filteredPagesList = availablePagesList.filter(page => {
                    const slug = `/${page.id === 'home' ? '' : page.id}`;
                    return page.label.toLowerCase().includes(seoSearchQuery.toLowerCase()) ||
                        slug.toLowerCase().includes(seoSearchQuery.toLowerCase());
                });

                const ITEMS_PER_PAGE = 10;
                const totalPages = Math.ceil(filteredPagesList.length / ITEMS_PER_PAGE);
                const currentPages = filteredPagesList.slice((seoCurrentPage - 1) * ITEMS_PER_PAGE, seoCurrentPage * ITEMS_PER_PAGE);

                return (
                    <div className="bg-white border border-gray-200 flex flex-col rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">SEO Page Manager</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Select a page below to manage its search engine optimization (meta tags).
                                </p>
                            </div>
                            <div className="w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search pages..."
                                    value={seoSearchQuery}
                                    onChange={(e) => {
                                        setSeoSearchQuery(e.target.value);
                                        setSeoCurrentPage(1);
                                    }}
                                    className="w-full border border-gray-300 p-2.5 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                                        <th className="py-4 px-6 font-semibold">Page Name</th>
                                        <th className="py-4 px-6 font-semibold">URL Slug</th>
                                        <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPages.map((page, idx) => (
                                        <tr key={page.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                            <td className="py-4 px-6 font-medium text-gray-900">{page.label}</td>
                                            <td className="py-4 px-6">
                                                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                                    /{page.id === 'home' ? '' : page.id}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSeoPage(page.id);
                                                            loadPageSeo(page.id);
                                                            router.push(`/admin/seo/edit`);
                                                        }}
                                                        title="Edit SEO"
                                                        className="bg-white border border-gray-200 hover:border-[#06056C] hover:bg-[#06056C] hover:text-white text-[#06056C] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"
                                                    >
                                                        <FiEdit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Are you sure you want to delete this page\'s SEO? This cannot be undone.')) {
                                                                toast.error('Delete functionality for standard pages is locked.');
                                                            }
                                                        }}
                                                        title="Delete SEO"
                                                        className="bg-white border border-gray-200 hover:border-[#CC0336] hover:bg-[#CC0336] hover:text-white text-[#CC0336] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                                <span className="text-sm text-gray-500">
                                    Showing <span className="font-medium">{filteredPagesList.length === 0 ? 0 : (seoCurrentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(seoCurrentPage * ITEMS_PER_PAGE, filteredPagesList.length)}</span> of <span className="font-medium">{filteredPagesList.length}</span> pages
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={seoCurrentPage === 1}
                                        onClick={() => setSeoCurrentPage(prev => Math.max(prev - 1, 1))}
                                        className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        disabled={seoCurrentPage === totalPages || totalPages === 0}
                                        onClick={() => setSeoCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                        {filteredPagesList.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No pages found matching "{seoSearchQuery}".
                            </div>
                        )}
                    </div>
                );
            case 'dashboard':
                return (
                    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
                        <div className="bg-gradient-to-br from-[#06056C] to-blue-900 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Welcome Back, Admin! 👋</h2>
                                <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
                                    You are currently viewing the Galaxy Regina administration dashboard. Navigate through the modules below to manage customer quotes, update service locations, write blog posts, and configure your website's SEO settings.
                                </p>
                            </div>
                        </div>

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
        faq: { title: 'FAQs', desc: 'Manage frequently asked questions.' },
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
                    {selectedTab === 'seo' && !subTab && (
                        <button onClick={() => router.push('/admin/seo/new')} className="bg-[#06056C] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm">
                            <span className="text-lg leading-none">+</span> Add Page SEO
                        </button>
                    )}
                    {selectedTab === 'faq' && !faqShowForm && (
                        <button
                            onClick={openNewFaq}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            + Add FAQ
                        </button>
                    )}
                    {selectedTab === 'blogs' && !blogShowForm && (
                        <button
                            onClick={() => blogRef.current?.openNewBlog()}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            + Add Blog
                        </button>
                    )}
                    {selectedTab === 'services' && !serviceShowForm && (
                        <button 
                            onClick={() => serviceRef.current?.openNewService()} 
                            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            + Create Service
                        </button>
                    )}
                    {selectedTab === 'locations' && !locationState.showForm && (
                        <button 
                            onClick={() => locationRef.current?.openNew()} 
                            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            + {locationState.activeTab === 'provinces' ? 'Add Province' : locationState.activeTab === 'districts' ? 'Add Region' : 'Add City'}
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