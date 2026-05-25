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
                    axios.get(
                        'http://localhost:5000/api/content/page/home'
                    ),
                    axios.get(
                        'http://localhost:5000/api/content/page/about'
                    ),
                    axios.get(
                        'http://localhost:5000/api/admin/faqs'
                    ),
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
                        heroTitle:
                            pageContent.hero.heroTitle || '',
                        heroSubtitle:
                            pageContent.hero.heroSubtitle || '',
                        heroCta:
                            pageContent.hero.heroCta || 'GET QUOTE',
                        heroPhone:
                            pageContent.hero.heroPhone ||
                            '(306) 450 0708',
                    });
                }

                if (pageContent.seo) {

                    setSeoForm({
                        homeTitle:
                            pageContent.seo.homeTitle ||
                            'Galaxy Movers Regina',

                        homeDescription:
                            pageContent.seo.homeDescription ||
                            '',
                    });
                }
            }

            if (aboutResponse.data.success) {

                const aboutContent =
                    aboutResponse.data.content || {};

                setContent((prev) => ({
                    ...prev,
                    about: aboutContent,
                }));

                if (aboutContent.about) {

                    setAboutForm({
                        heroTitle:
                            aboutContent.about.heroTitle || '',
                        heroSubtitle:
                            aboutContent.about.heroSubtitle || '',
                        storyTitle:
                            aboutContent.about.storyTitle || '',
                        storyText:
                            aboutContent.about.storyText || '',
                        missionTitle:
                            aboutContent.about.missionTitle || '',
                        missionText:
                            aboutContent.about.missionText || '',
                        whyTitle:
                            aboutContent.about.whyTitle || '',
                        whyPoint1:
                            aboutContent.about.whyPoint1 || '',
                        whyPoint2:
                            aboutContent.about.whyPoint2 || '',
                        whyPoint3:
                            aboutContent.about.whyPoint3 || '',
                        imageUrl:
                            aboutContent.about.imageUrl || '',
                    });
                }

                if (aboutContent.seo) {

                    setAboutSeoForm({
                        aboutTitle:
                            aboutContent.seo.aboutTitle || '',

                        aboutDescription:
                            aboutContent.seo.aboutDescription || '',
                    });
                }
            }

        } catch (error) {

            console.error(
                'Failed to load content',
                error
            );

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

            await axios.put(
                'http://localhost:5000/api/content/page/home/hero',
                heroForm
            );

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

            await axios.put(
                'http://localhost:5000/api/content/page/home/seo',
                seoForm
            );

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

            await axios.put(
                'http://localhost:5000/api/content/page/about/about',
                aboutForm
            );

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

            await axios.put(
                'http://localhost:5000/api/content/page/about/seo',
                aboutSeoForm
            );

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

            const response = await axios.get(
                'http://localhost:5000/api/admin/faqs'
            );

            if (response.data.success) {
                setFaqs(response.data.faqs || []);
            }

        } catch (error) {

            console.error(
                'Failed to load FAQs',
                error
            );

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

                await axios.put(
                    `http://localhost:5000/api/admin/faqs/${editingFaqId}`,
                    faqForm
                );

                alert('FAQ updated successfully');

            } else {

                await axios.post(
                    'http://localhost:5000/api/admin/faqs',
                    faqForm
                );

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

            await axios.delete(
                `http://localhost:5000/api/admin/faqs/${id}`
            );

            setFaqs(
                faqs.filter((faq) => faq.id !== id)
            );

        } catch (error) {

            console.error(error);

            alert('Failed to delete FAQ');

        }
    };

    // FAQ LOCK
    const toggleFaqLock = async (id, locked) => {

        try {

            await axios.patch(
                `http://localhost:5000/api/admin/faqs/${id}/lock`,
                { locked }
            );

            setFaqs(
                faqs.map((faq) =>
                    faq.id === id
                        ? { ...faq, locked }
                        : faq
                )
            );

        } catch (error) {

            console.error(error);

            alert('Failed to update FAQ');

        }
    };

    // EDIT FAQ
    const editFaq = (faq) => {

        setFaqForm({
            question: faq.question,
            answer: faq.answer,
        });

        setEditingFaqId(faq.id);

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

            case 'faq':
                return (
                    <div className="panel-card">

                        <h2>FAQ Management</h2>

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

                        <button
                            className="save-btn"
                            onClick={saveFaq}
                        >
                            {
                                editingFaqId
                                    ? 'Update FAQ'
                                    : 'Add FAQ'
                            }
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
                            selectedTab === 'dashboard'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            setSelectedTab('dashboard')
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'quotes'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            setSelectedTab('quotes')
                        }
                    >
                        Quotes
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'locations'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            setSelectedTab('locations')
                        }
                    >
                        Locations
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'blogs'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            setSelectedTab('blogs')
                        }
                    >
                        Blogs
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'about'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            setSelectedTab('about')
                        }
                    >
                        About Page
                    </button>

                    <button
                        className={`sidebar-item ${
                            selectedTab === 'faq'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            setSelectedTab('faq')
                        }
                    >
                        FAQs
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

                                localStorage.removeItem(
                                    'admin'
                                );

                                document.cookie =
                                    'admin=; path=/; max-age=0';

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