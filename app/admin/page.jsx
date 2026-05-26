// src/AdminDashboard/AdminDashboard.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import QuotesManagement from '../../src/AdminDashboard/uotesManagement';
import LocationManagement from '../../src/AdminDashboard/LocationManagement';
import BlogManagement from '../../src/AdminDashboard/BlogManagement';

import '../../src/AdminDashboard/css/AdminDashboard.css';

const AdminDashboard = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('dashboard');
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
    const [selectedSeoPage, setSelectedSeoPage] = useState('home');
    const [seoManagerForm, setSeoManagerForm] = useState({
        title: '',
        description: '',
        keywords: '',
    });
    const [globalScriptsForm, setGlobalScriptsForm] = useState({
        header: '',
        footer: '',
    });

    const [saving, setSaving] = useState(false);

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

            // Load Global scripts and dynamic SEO on initialization
            loadPageSeo('home');
            loadGlobalScripts();
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
            alert('Hero content saved successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to save hero content');
        } finally {
            setSaving(false);
        }
    };

    // SAVE SEO
    const saveSeoContent = async () => {
        setSaving(true);
        try {
            await axios.put('/api/content/page/home/seo', seoForm);
            alert('SEO content saved successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to save SEO content');
        } finally {
            setSaving(false);
        }
    };

    // SAVE ABOUT
    const saveAboutContent = async () => {
        setSaving(true);
        try {
            await axios.put('/api/content/page/about/about', aboutForm);
            alert('About page content saved successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to save about page content');
        } finally {
            setSaving(false);
        }
    };

    // SAVE ABOUT SEO
    const saveAboutSeoContent = async () => {
        setSaving(true);
        try {
            await axios.put('/api/content/page/about/seo', aboutSeoForm);
            alert('About page SEO saved successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to save about page SEO');
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
            alert('Please enter both question and answer');
            return;
        }

        setSaving(true);
        try {
            if (editingFaqId) {
                await axios.put(`/api/admin/faqs/${editingFaqId}`, faqForm);
                alert('FAQ updated successfully');
            } else {
                await axios.post('/api/admin/faqs', faqForm);
                alert('FAQ added successfully');
            }
            resetFaqForm();
            loadFaqs();
        } catch (error) {
            console.error(error);
            alert('Failed to save FAQ');
        } finally {
            setSaving(false);
        }
    };

    // DELETE FAQ
    const deleteFaq = async (id) => {
        if (!window.confirm('Delete this FAQ?')) return;
        try {
            await axios.delete(`/api/admin/faqs/${id}`);
            setFaqs(faqs.filter((faq) => faq.id !== id));
            alert('FAQ deleted successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to delete FAQ');
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
            alert(`FAQ ${locked ? 'Locked' : 'Unlocked'} Successfully`);
        } catch (error) {
            console.error(error);
            alert('Failed to update FAQ lock status');
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
            alert(`SEO settings for "${selectedSeoPage}" saved successfully`);
        } catch (error) {
            console.error(error);
            alert("Failed to save page SEO settings");
        } finally {
            setSaving(false);
        }
    };

    // LOAD GLOBAL SCRIPTS
    const loadGlobalScripts = async () => {
        try {
            const res = await axios.get('/api/content/page/global');
            if (res.data.success) {
                const scripts = res.data.content?.scripts || {};
                setGlobalScriptsForm({
                    header: scripts.header || '',
                    footer: scripts.footer || '',
                });
            }
        } catch (error) {
            console.error("Failed to load global scripts", error);
        }
    };

    // SAVE GLOBAL SCRIPTS
    const saveGlobalScripts = async () => {
        setSaving(true);
        try {
            await axios.put('/api/content/page/global/scripts', globalScriptsForm);
            alert("Global header and footer scripts saved successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to save global scripts");
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
                return <LocationManagement />;

            case 'blogs':
                return <BlogManagement />;

            case 'about':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div className="panel-card">
                            <h2>About Page Content</h2>
                            <div className="panel-group">
                                <label>Hero Title</label>
                                <input
                                    name="heroTitle"
                                    value={aboutForm.heroTitle}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Hero Subtitle</label>
                                <input
                                    name="heroSubtitle"
                                    value={aboutForm.heroSubtitle}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Story Title</label>
                                <input
                                    name="storyTitle"
                                    value={aboutForm.storyTitle}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Story Text</label>
                                <textarea
                                    name="storyText"
                                    value={aboutForm.storyText}
                                    onChange={handleAboutChange}
                                    rows={6}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Mission Title</label>
                                <input
                                    name="missionTitle"
                                    value={aboutForm.missionTitle}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Mission Text</label>
                                <textarea
                                    name="missionText"
                                    value={aboutForm.missionText}
                                    onChange={handleAboutChange}
                                    rows={4}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Why Choose Us Title</label>
                                <input
                                    name="whyTitle"
                                    value={aboutForm.whyTitle}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Why Point 1</label>
                                <input
                                    name="whyPoint1"
                                    value={aboutForm.whyPoint1}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Why Point 2</label>
                                <input
                                    name="whyPoint2"
                                    value={aboutForm.whyPoint2}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Why Point 3</label>
                                <input
                                    name="whyPoint3"
                                    value={aboutForm.whyPoint3}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <div className="panel-group">
                                <label>About Image URL</label>
                                <input
                                    name="imageUrl"
                                    value={aboutForm.imageUrl}
                                    onChange={handleAboutChange}
                                />
                            </div>
                            <button
                                className="save-btn"
                                onClick={saveAboutContent}
                                disabled={saving}
                            >
                                Save About Content
                            </button>
                        </div>

                        <div className="panel-card">
                            <h2>About Page SEO</h2>
                            <div className="panel-group">
                                <label>Meta Title</label>
                                <input
                                    name="aboutTitle"
                                    value={aboutSeoForm.aboutTitle}
                                    onChange={handleAboutSeoChange}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Meta Description</label>
                                <textarea
                                    name="aboutDescription"
                                    value={aboutSeoForm.aboutDescription}
                                    onChange={handleAboutSeoChange}
                                    rows={3}
                                />
                            </div>
                            <button
                                className="save-btn"
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
                        <div className="panel-card">
                            <h2>{editingFaqId ? 'Edit FAQ' : 'Add FAQ'}</h2>
                            <div className="panel-group">
                                <label>Question</label>
                                <input
                                    name="question"
                                    value={faqForm.question}
                                    onChange={handleFaqChange}
                                />
                            </div>
                            <div className="panel-group">
                                <label>Answer</label>
                                <textarea
                                    name="answer"
                                    value={faqForm.answer}
                                    onChange={handleFaqChange}
                                    rows={4}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    className="save-btn"
                                    onClick={saveFaq}
                                    disabled={saving}
                                >
                                    {editingFaqId ? 'Update FAQ' : 'Add FAQ'}
                                </button>
                                {editingFaqId && (
                                    <button
                                        className="save-btn"
                                        style={{ backgroundColor: '#64748b' }}
                                        onClick={resetFaqForm}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="panel-card">
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
                    </div>
                );

            case 'seo':
                return (
                    <div className="panel-card">
                        <h2>SEO Page Manager</h2>
                        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                            Manage search engine optimization (meta tags) for pages on the website. Changes are dynamically reflected in page headers.
                        </p>
                        <div className="panel-group">
                            <label>Select Page to Manage</label>
                            <select
                                value={selectedSeoPage}
                                onChange={handleSeoPageChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', color: '#1e293b' }}
                            >
                                <option value="home">Home Page</option>
                                <option value="about">About Page</option>
                                <option value="faq">FAQ Page</option>
                                <option value="blogs">Blogs List Page</option>
                                <option value="house-moving">House Moving Page</option>
                                <option value="manpower">Manpower Page</option>
                                <option value="storage-services">Storage Services Page</option>
                                <option value="insurance">Insurance Page</option>
                                <option value="license">License Page</option>
                                <option value="licensee">Licensee Page</option>
                                <option value="insurance-policy-claims">Insurance Policy Claims Page</option>
                            </select>
                        </div>
                        <div className="panel-group">
                            <label>Meta Title</label>
                            <input
                                value={seoManagerForm.title}
                                onChange={(e) => setSeoManagerForm({ ...seoManagerForm, title: e.target.value })}
                                placeholder="Enter SEO Meta Title..."
                            />
                        </div>
                        <div className="panel-group">
                            <label>Meta Description</label>
                            <textarea
                                value={seoManagerForm.description}
                                onChange={(e) => setSeoManagerForm({ ...seoManagerForm, description: e.target.value })}
                                placeholder="Enter SEO Meta Description..."
                                rows={4}
                            />
                        </div>
                        <div className="panel-group">
                            <label>Meta Keywords</label>
                            <input
                                value={seoManagerForm.keywords}
                                onChange={(e) => setSeoManagerForm({ ...seoManagerForm, keywords: e.target.value })}
                                placeholder="Enter SEO Meta Keywords (comma separated)..."
                            />
                        </div>
                        <button
                            className="save-btn"
                            onClick={savePageSeo}
                            disabled={saving}
                        >
                            Save Page SEO
                        </button>
                    </div>
                );

            case 'scripts':
                return (
                    <div className="panel-card">
                        <h2>Global Header and Footer Scripts</h2>
                        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                            Insert tracking scripts, pixels, or custom tags (e.g. Google Analytics, Facebook Pixel, GTM, Google Search Console verification). Make sure to paste the complete HTML block including tags like <code>&lt;script&gt;</code>, <code>&lt;noscript&gt;</code>, or <code>&lt;style&gt;</code>.
                        </p>
                        <div className="panel-group">
                            <label>Header Scripts (Injected immediately inside the &lt;body&gt; tag)</label>
                            <textarea
                                value={globalScriptsForm.header}
                                onChange={(e) => setGlobalScriptsForm({ ...globalScriptsForm, header: e.target.value })}
                                placeholder="<!-- Paste GTM, Pixel, tracking codes here -->"
                                rows={10}
                                style={{ fontFamily: 'monospace', fontSize: '14px', backgroundColor: '#0f172a', color: '#f8fafc' }}
                            />
                        </div>
                        <div className="panel-group">
                            <label>Footer Scripts (Injected at the very bottom of &lt;body&gt; tag)</label>
                            <textarea
                                value={globalScriptsForm.footer}
                                onChange={(e) => setGlobalScriptsForm({ ...globalScriptsForm, footer: e.target.value })}
                                placeholder="<!-- Paste other footer script blocks here -->"
                                rows={10}
                                style={{ fontFamily: 'monospace', fontSize: '14px', backgroundColor: '#0f172a', color: '#f8fafc' }}
                            />
                        </div>
                        <button
                            className="save-btn"
                            onClick={saveGlobalScripts}
                            disabled={saving}
                        >
                            Save Global Scripts
                        </button>
                    </div>
                );

            default:
                return (
                    <div className="dashboard-welcome">
                        <h2>Welcome Admin</h2>
                        <p>
                            Manage your website content.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="admin-page">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <h2>Galaxy Admin</h2>
                    <p>Full site manager</p>
                </div>

                <nav className="sidebar-menu">
                    <button
                        className={`sidebar-item ${
                            selectedTab === 'dashboard' ? 'active' : ''
                        }`}
                        onClick={() => setSelectedTab('dashboard')}
                    >
                        Dashboard
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'quotes' ? 'active' : ''
                        }`}
                        onClick={() => setSelectedTab('quotes')}
                    >
                        Quotes
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'locations' ? 'active' : ''
                        }`}
                        onClick={() => setSelectedTab('locations')}
                    >
                        Locations
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'blogs' ? 'active' : ''
                        }`}
                        onClick={() => setSelectedTab('blogs')}
                    >
                        Blogs
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'about' ? 'active' : ''
                        }`}
                        onClick={() => setSelectedTab('about')}
                    >
                        About Page
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'faq' ? 'active' : ''
                        }`}
                        onClick={() => setSelectedTab('faq')}
                    >
                        FAQs
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'seo' ? 'active' : ''
                        }`}
                        onClick={() => setSelectedTab('seo')}
                    >
                        SEO Manager
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'scripts' ? 'active' : ''
                        }`}
                        onClick={() => setSelectedTab('scripts')}
                    >
                        Global Scripts
                    </button>
                </nav>
            </aside>

            {/* MAIN */}
            <main className="main-content">
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <div>
                            <h1>Admin Dashboard</h1>
                            <p>
                                Manage website content.
                            </p>
                        </div>

                        <button
                            className="logout-btn"
                            onClick={() => {
                                localStorage.removeItem('admin');
                                document.cookie = 'admin=; path=/; max-age=0';
                                router.push('/admin/login');
                            }}
                        >
                            Logout
                        </button>
                    </div>

                    {renderPanel()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;