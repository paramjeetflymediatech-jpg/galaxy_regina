import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Save, 
    Globe, 
    Upload, 
    Plus, 
    Trash2, 
    Edit2,
    Settings,
    FileText,
    Zap
} from 'lucide-react';

const HomePageEditor = () => {
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Hero Banner State
    const [heroBanner, setHeroBanner] = useState({
        mainHeading: 'Welcome to Galaxy Movers',
        subHeading: 'Professional Moving & Relocation Services',
        primaryBtn: 'Get Free Quote',
        secondaryBtn: 'Learn More',
        backgroundImage: null,
        backgroundPreview: null
    });

    // Features State
    const [features, setFeatures] = useState([
        { id: 1, title: 'Fast Service', description: 'Quick and efficient moving solutions', icon: '⚡' },
        { id: 2, title: 'Licensed Movers', description: 'Fully licensed and insured professionals', icon: '✓' },
        { id: 3, title: 'Affordable Rates', description: 'Competitive pricing for all budgets', icon: '💰' },
        { id: 4, title: '24/7 Support', description: 'Round-the-clock customer support', icon: '📞' }
    ]);

    // About Section State
    const [aboutSection, setAboutSection] = useState({
        title: 'About Galaxy Movers',
        content: 'We are dedicated to providing exceptional moving services with a commitment to excellence.',
        image: null
    });

    // Services State
    const [servicesSection, setServicesSection] = useState({
        title: 'Our Services',
        description: 'Comprehensive moving solutions tailored to your needs'
    });

    const [serviceCards, setServiceCards] = useState([
        {
            id: 1,
            title: 'HOUSE MOVERS',
            desc: 'Galaxy movers offer reliable and easy house moving services customized to your needs. Our expert team ensures careful handling, timely delivery and after support. So, you can enjoy your relocation allowing us to handle the stress.',
            image: 'https://galaxymoversregina.ca/wp-content/uploads/2025/08/House-Movers.jpg',
            detail: 'Our house moving service includes packing, loading, transport, unloading and setup at your new home. We protect your belongings with premium materials and handle every step with care.',
            slug: 'house-movers'
        },
        {
            id: 2,
            title: 'CONDO & APARTMENT MOVERS',
            desc: 'Specialized in narrow spaces, elevators & tight access. Safe and efficient condo moving.',
            image: 'https://galaxymoversregina.ca/wp-content/uploads/2025/08/Condo-Apartment-Movers.jpg',
            detail: 'Condo moves require special planning, elevator booking and precise handling. Our team is experienced with condo rules and apartment move logistics.',
            slug: 'condo-apartment-movers'
        },
        {
            id: 3,
            title: 'COMMERCIAL & OFFICE MOVERS',
            desc: 'Expert office relocation with minimal downtime. We handle furniture, equipment & sensitive items.',
            image: 'https://galaxymoversregina.ca/wp-content/uploads/2025/08/Commercial-Office-Movers.jpg',
            detail: 'We manage office layout planning, equipment protection, IT relocation and efficient setup so your business can resume quickly.',
            slug: 'commercial-office-movers'
        },
        {
            id: 4,
            title: 'LONG DISTANCE MOVERS',
            desc: 'Safe and reliable long-distance moving across Canada with full tracking and insurance.',
            image: 'https://galaxymoversregina.ca/wp-content/uploads/2025/08/Long-Distance-Moving-Regina.jpg',
            detail: 'Long distance moves are planned end-to-end with premium transport, insurance and secure loading so your belongings arrive safely and on time.',
            slug: 'long-distance-movers'
        }
    ]);

    const slugify = (text) =>
        text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    const loadHomePageContent = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/content/page/home');
            if (response.data.success) {
                const content = response.data.content || {};

                if (content.hero) {
                    setHeroBanner(prev => ({
                        ...prev,
                        mainHeading: content.hero.mainHeading || prev.mainHeading,
                        subHeading: content.hero.subHeading || prev.subHeading,
                        primaryBtn: content.hero.primaryBtn || prev.primaryBtn,
                        secondaryBtn: content.hero.secondaryBtn || prev.secondaryBtn,
                        backgroundPreview: content.hero.backgroundPreview || prev.backgroundPreview
                    }));
                }

                if (content.features?.items) {
                    try {
                        const loadedFeatures = JSON.parse(content.features.items);
                        if (Array.isArray(loadedFeatures) && loadedFeatures.length > 0) {
                            setFeatures(loadedFeatures);
                        }
                    } catch {
                        console.warn('Failed to parse features content');
                    }
                }

                if (content.about) {
                    setAboutSection(prev => ({
                        ...prev,
                        title: content.about.title || prev.title,
                        content: content.about.content || prev.content,
                        image: content.about.image || prev.image
                    }));
                }

                if (content.services) {
                    const servicesContent = content.services;
                    setServicesSection(prev => ({
                        ...prev,
                        title: servicesContent.title || prev.title,
                        description: servicesContent.description || prev.description
                    }));

                    if (servicesContent.cards) {
                        try {
                            const cards = JSON.parse(servicesContent.cards);
                            if (Array.isArray(cards) && cards.length > 0) {
                                setServiceCards(cards.map(card => ({
                                    ...card,
                                    slug: card.slug || slugify(card.title || `service-${Math.random()}`)
                                })));
                            }
                        } catch {
                            console.warn('Failed to parse service cards content');
                        }
                    }
                }

                if (content.testimonials?.items) {
                    try {
                        const loadedTestimonials = JSON.parse(content.testimonials.items);
                        if (Array.isArray(loadedTestimonials) && loadedTestimonials.length > 0) {
                            setTestimonials(loadedTestimonials);
                        }
                    } catch {
                        console.warn('Failed to parse testimonials content');
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load homepage content:', error);
        }
    };

    useEffect(() => {
        loadHomePageContent();
    }, []);

    const updateServiceCard = (id, field, value) => {
        setServiceCards(prev => prev.map(card => card.id === id ? { ...card, [field]: value, slug: field === 'title' ? slugify(value) : card.slug } : card));
    };

    const addServiceCard = () => {
        const nextId = Math.max(...serviceCards.map(card => card.id), 0) + 1;
        setServiceCards(prev => [
            ...prev,
            {
                id: nextId,
                title: 'New Service',
                desc: 'Service description goes here.',
                image: '',
                detail: 'Detailed service description will show on the service page.',
                slug: `service-${nextId}`
            }
        ]);
    };

    const removeServiceCard = (id) => {
        setServiceCards(prev => prev.filter(card => card.id !== id));
    };

    const saveSection = async (section, data) => {
        return axios.put(`http://localhost:5000/api/content/page/home/${section}`, data);
    };

    const saveHeroSection = async (silent = false) => {
        try {
            await saveSection('hero', {
                mainHeading: heroBanner.mainHeading,
                subHeading: heroBanner.subHeading,
                primaryBtn: heroBanner.primaryBtn,
                secondaryBtn: heroBanner.secondaryBtn,
                backgroundPreview: heroBanner.backgroundPreview || ''
            });
            if (!silent) alert('Hero section saved successfully');
        } catch (error) {
            console.error('Failed to save hero section:', error);
            if (!silent) alert('There was an error saving the hero section.');
            throw error;
        }
    };

    const saveFeaturesSection = async (silent = false) => {
        try {
            await saveSection('features', {
                items: JSON.stringify(features)
            });
            if (!silent) alert('Features saved successfully');
        } catch (error) {
            console.error('Failed to save features section:', error);
            if (!silent) alert('There was an error saving the features section.');
            throw error;
        }
    };

    const saveAboutSection = async (silent = false) => {
        try {
            await saveSection('about', {
                title: aboutSection.title,
                content: aboutSection.content,
                image: aboutSection.image || ''
            });
            if (!silent) alert('About section saved successfully');
        } catch (error) {
            console.error('Failed to save about section:', error);
            if (!silent) alert('There was an error saving the about section.');
            throw error;
        }
    };

    const saveServicesSection = async (silent = false) => {
        try {
            await saveSection('services', {
                title: servicesSection.title,
                description: servicesSection.description,
                cards: JSON.stringify(serviceCards)
            });
            if (!silent) alert('Services section saved successfully');
        } catch (error) {
            console.error('Failed to save services section:', error);
            if (!silent) alert('There was an error saving the services content.');
            throw error;
        }
    };

    const saveTestimonialsSection = async (silent = false) => {
        try {
            await saveSection('testimonials', {
                items: JSON.stringify(testimonials)
            });
            if (!silent) alert('Testimonials saved successfully');
        } catch (error) {
            console.error('Failed to save testimonials section:', error);
            if (!silent) alert('There was an error saving the testimonials section.');
            throw error;
        }
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            await Promise.all([
                saveHeroSection(true),
                saveFeaturesSection(true),
                saveAboutSection(true),
                saveServicesSection(true),
                saveTestimonialsSection(true)
            ]);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            alert('There was an error saving the homepage content.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            await Promise.all([
                saveHeroSection(true),
                saveFeaturesSection(true),
                saveAboutSection(true),
                saveServicesSection(true),
                saveTestimonialsSection(true)
            ]);
            alert('Published successfully to website!');
        } catch (error) {
            alert('Failed to publish homepage content.');
        } finally {
            setIsPublishing(false);
        }
    };

    // Testimonials State
    const [testimonials, setTestimonials] = useState([
        { id: 1, name: 'John Doe', company: 'Tech Corp', text: 'Best moving service ever!', rating: 5 },
        { id: 2, name: 'Jane Smith', company: 'Design Co', text: 'Professional and reliable team', rating: 5 }
    ]);

    // Hero Banner Handlers
    const handleHeroChange = (field, value) => {
        setHeroBanner(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeroBanner(prev => ({
                    ...prev,
                    backgroundImage: file,
                    backgroundPreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAboutImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAboutSection(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Features Handlers
    const addFeature = () => {
        const newFeature = {
            id: Math.max(...features.map(f => f.id), 0) + 1,
            title: 'New Feature',
            description: 'Feature description',
            icon: '✨'
        };
        setFeatures([...features, newFeature]);
    };

    const updateFeature = (id, field, value) => {
        setFeatures(features.map(f => f.id === id ? { ...f, [field]: value } : f));
    };

    const removeFeature = (id) => {
        setFeatures(features.filter(f => f.id !== id));
    };

    // Testimonials Handlers
    const addTestimonial = () => {
        const newTestimonial = {
            id: Math.max(...testimonials.map(t => t.id), 0) + 1,
            name: 'New Customer',
            company: 'Company Name',
            text: 'Testimonial text here',
            rating: 5
        };
        setTestimonials([...testimonials, newTestimonial]);
    };

    const updateTestimonial = (id, field, value) => {
        setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const removeTestimonial = (id) => {
        setTestimonials(testimonials.filter(t => t.id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a1f3a] to-[#0f172a]">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur border-b border-blue-500/20">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-lg">
                                <Edit2 size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Edit Home Page</h1>
                                <p className="text-gray-400 text-sm">Manage your website content</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveDraft}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {isSaving ? 'Saving...' : 'Save Draft'}
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 font-semibold shadow-lg"
                            >
                                <Globe size={18} />
                                {isPublishing ? 'Publishing...' : 'Publish to Website'}
                            </button>
                        </div>
                    </div>

                    {/* Success Message */}
                    {saveSuccess && (
                        <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400">
                            <span>✓</span>
                            <span>Draft saved successfully!</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-4 border-b border-blue-500/20">
                    {[
                        { id: 'hero', label: 'Hero Banner', icon: Zap },
                        { id: 'features', label: 'Features', icon: Star },
                        { id: 'about', label: 'About', icon: FileText },
                        { id: 'services', label: 'Services', icon: Settings },
                        { id: 'testimonials', label: 'Testimonials', icon: Users }
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all duration-200 whitespace-nowrap font-medium ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white bg-[#1a1f3a] hover:bg-[#242d4a]'
                                }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Editor */}
                    <div className="lg:col-span-2">
                        {/* Hero Banner Tab */}
                        {activeTab === 'hero' && (
                            <div className="space-y-6">
                                <div className="bg-[#1a1f3a] rounded-xl border border-blue-500/20 p-8 shadow-xl">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Zap size={20} className="text-blue-400" />
                                        Hero Banner Section
                                    </h2>

                                    <div className="space-y-5">
                                        {/* Main Heading */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Main Heading
                                            </label>
                                            <input
                                                type="text"
                                                value={heroBanner.mainHeading}
                                                onChange={(e) => handleHeroChange('mainHeading', e.target.value)}
                                                className="w-full px-4 py-3 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                                placeholder="Enter main heading"
                                            />
                                        </div>

                                        {/* Sub Heading */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Sub Heading
                                            </label>
                                            <input
                                                type="text"
                                                value={heroBanner.subHeading}
                                                onChange={(e) => handleHeroChange('subHeading', e.target.value)}
                                                className="w-full px-4 py-3 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                                placeholder="Enter sub heading"
                                            />
                                        </div>

                                        {/* Button Texts */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Primary Button Text
                                                </label>
                                                <input
                                                    type="text"
                                                    value={heroBanner.primaryBtn}
                                                    onChange={(e) => handleHeroChange('primaryBtn', e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                                    placeholder="e.g., Get Started"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Secondary Button Text
                                                </label>
                                                <input
                                                    type="text"
                                                    value={heroBanner.secondaryBtn}
                                                    onChange={(e) => handleHeroChange('secondaryBtn', e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                                    placeholder="e.g., Learn More"
                                                />
                                            </div>
                                        </div>

                                        {/* Background Image */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Hero Background Image
                                            </label>
                                            <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-blue-500/30 rounded-lg cursor-pointer hover:border-blue-500/60 hover:bg-blue-500/5 transition-all duration-200">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload size={24} className="text-blue-400" />
                                                    <span className="text-gray-300 font-medium">Click to upload image</span>
                                                    <span className="text-sm text-gray-500">or drag and drop</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features Tab */}
                        {activeTab === 'features' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Star size={20} className="text-blue-400" />
                                        Features / Stats Cards
                                    </h2>
                                    <button
                                        onClick={addFeature}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                                    >
                                        <Plus size={18} />
                                        Add Feature
                                    </button>
                                </div>

                                {features.map((feature) => (
                                    <div key={feature.id} className="bg-[#1a1f3a] rounded-xl border border-blue-500/20 p-6 shadow-xl">
                                        <div className="flex gap-4">
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Icon (Emoji)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength="2"
                                                        value={feature.icon}
                                                        onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                                                        className="w-16 px-3 py-2 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={feature.title}
                                                        onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                                                        className="w-full px-4 py-2 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        value={feature.description}
                                                        onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                                                        className="w-full px-4 py-2 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                        rows="2"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFeature(feature.id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* About Tab */}
                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <div className="bg-[#1a1f3a] rounded-xl border border-blue-500/20 p-8 shadow-xl">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <FileText size={20} className="text-blue-400" />
                                        About Section
                                    </h2>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Section Title
                                            </label>
                                            <input
                                                type="text"
                                                value={aboutSection.title}
                                                onChange={(e) => setAboutSection({ ...aboutSection, title: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Content
                                            </label>
                                            <textarea
                                                value={aboutSection.content}
                                                onChange={(e) => setAboutSection({ ...aboutSection, content: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                rows="6"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Section Image
                                            </label>
                                            <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-blue-500/30 rounded-lg cursor-pointer hover:border-blue-500/60 hover:bg-blue-500/5 transition-all duration-200">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload size={24} className="text-blue-400" />
                                                    <span className="text-gray-300 font-medium">Click to upload image</span>
                                                </div>
                                                <input type="file" accept="image/*" onChange={handleAboutImageUpload} className="hidden" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Services Tab */}
                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="bg-[#1a1f3a] rounded-xl border border-blue-500/20 p-8 shadow-xl">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Settings size={20} className="text-blue-400" />
                                        Services Section
                                    </h2>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Section Title
                                            </label>
                                            <input
                                                type="text"
                                                value={servicesSection.title}
                                                onChange={(e) => setServicesSection({ ...servicesSection, title: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={servicesSection.description}
                                                onChange={(e) => setServicesSection({ ...servicesSection, description: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                rows="4"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#1a1f3a] rounded-xl border border-blue-500/20 p-8 shadow-xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Service Cards</h3>
                                            <p className="text-gray-400 text-sm">Edit the cards that appear in the homepage services section.</p>
                                        </div>
                                        <button
                                            onClick={addServiceCard}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all duration-200"
                                        >
                                            <Plus size={16} /> Add Card
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {serviceCards.map((card) => (
                                            <div key={card.id} className="bg-[#0f172a] border border-blue-500/20 rounded-xl p-4">
                                                <div className="flex flex-col gap-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                                            <input
                                                                type="text"
                                                                value={card.title}
                                                                onChange={(e) => updateServiceCard(card.id, 'title', e.target.value)}
                                                                className="w-full px-3 py-2 bg-[#111827] border border-blue-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                                                            <input
                                                                type="text"
                                                                value={card.image}
                                                                onChange={(e) => updateServiceCard(card.id, 'image', e.target.value)}
                                                                className="w-full px-3 py-2 bg-[#111827] border border-blue-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                                        <textarea
                                                            value={card.desc}
                                                            onChange={(e) => updateServiceCard(card.id, 'desc', e.target.value)}
                                                            className="w-full px-3 py-2 bg-[#111827] border border-blue-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                            rows="3"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">Detail Page Text</label>
                                                        <textarea
                                                            value={card.detail}
                                                            onChange={(e) => updateServiceCard(card.id, 'detail', e.target.value)}
                                                            className="w-full px-3 py-2 bg-[#111827] border border-blue-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                            rows="3"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                                                            <input
                                                                type="text"
                                                                value={card.slug}
                                                                onChange={(e) => updateServiceCard(card.id, 'slug', e.target.value)}
                                                                className="w-full px-3 py-2 bg-[#111827] border border-blue-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => removeServiceCard(card.id)}
                                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all duration-200"
                                                        >
                                                            Remove Card
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={saveServicesSection}
                                        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200"
                                    >
                                        Save Services Section
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Testimonials Tab */}
                        {activeTab === 'testimonials' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Users size={20} className="text-blue-400" />
                                        Customer Testimonials
                                    </h2>
                                    <button
                                        onClick={addTestimonial}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                                    >
                                        <Plus size={18} />
                                        Add Testimonial
                                    </button>
                                </div>

                                {testimonials.map((testimonial) => (
                                    <div key={testimonial.id} className="bg-[#1a1f3a] rounded-xl border border-blue-500/20 p-6 shadow-xl">
                                        <div className="flex gap-4">
                                            <div className="flex-1 space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Customer Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={testimonial.name}
                                                            onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                                                            className="w-full px-4 py-2 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Company
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={testimonial.company}
                                                            onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                                                            className="w-full px-4 py-2 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Testimonial
                                                    </label>
                                                    <textarea
                                                        value={testimonial.text}
                                                        onChange={(e) => updateTestimonial(testimonial.id, 'text', e.target.value)}
                                                        className="w-full px-4 py-2 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                        rows="2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Rating
                                                    </label>
                                                    <select
                                                        value={testimonial.rating}
                                                        onChange={(e) => updateTestimonial(testimonial.id, 'rating', parseInt(e.target.value))}
                                                        className="w-full px-4 py-2 bg-[#0f172a] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {[5, 4, 3, 2, 1].map(num => (
                                                            <option key={num} value={num}>{num} Stars</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeTestimonial(testimonial.id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-[#1a1f3a] rounded-xl border border-blue-500/20 p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4">Preview</h3>

                            {activeTab === 'hero' && (
                                <div className="space-y-3">
                                    <div
                                        className="rounded-lg h-32 bg-cover bg-center border border-blue-500/30"
                                        style={{
                                            backgroundImage: heroBanner.backgroundPreview ? `url(${heroBanner.backgroundPreview})` : 'none',
                                            backgroundColor: heroBanner.backgroundPreview ? 'transparent' : '#0f172a'
                                        }}
                                    />
                                    <div>
                                        <h4 className="text-white font-bold text-base line-clamp-2">{heroBanner.mainHeading}</h4>
                                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{heroBanner.subHeading}</p>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <div className="text-xs px-2 py-1 bg-blue-600 text-white rounded">
                                            {heroBanner.primaryBtn}
                                        </div>
                                        <div className="text-xs px-2 py-1 border border-blue-600 text-blue-400 rounded">
                                            {heroBanner.secondaryBtn}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'features' && (
                                <div className="space-y-3">
                                    <p className="text-gray-400 text-sm mb-3">{features.length} Features</p>
                                    {features.slice(0, 2).map(feature => (
                                        <div key={feature.id} className="p-3 bg-[#0f172a] rounded-lg border border-blue-500/20">
                                            <div className="text-2xl mb-1">{feature.icon}</div>
                                            <p className="text-white font-medium text-sm line-clamp-1">{feature.title}</p>
                                            <p className="text-gray-400 text-xs line-clamp-1">{feature.description}</p>
                                        </div>
                                    ))}
                                    {features.length > 2 && (
                                        <p className="text-xs text-gray-500 text-center pt-2">+{features.length - 2} more features</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'about' && (
                                <div className="space-y-3">
                                    <h4 className="text-white font-bold text-sm line-clamp-2">{aboutSection.title}</h4>
                                    <p className="text-gray-400 text-xs line-clamp-3">{aboutSection.content}</p>
                                </div>
                            )}

                            {activeTab === 'services' && (
                                <div className="space-y-3">
                                    <h4 className="text-white font-bold text-sm">{servicesSection.title}</h4>
                                    <p className="text-gray-400 text-xs line-clamp-3">{servicesSection.description}</p>
                                </div>
                            )}

                            {activeTab === 'testimonials' && (
                                <div className="space-y-3">
                                    <p className="text-gray-400 text-sm mb-3">{testimonials.length} Testimonials</p>
                                    {testimonials[0] && (
                                        <div className="p-3 bg-[#0f172a] rounded-lg border border-blue-500/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-medium text-white">{testimonials[0].name}</span>
                                                <span className="text-xs text-blue-400">{testimonials[0].company}</span>
                                            </div>
                                            <p className="text-gray-400 text-xs line-clamp-2">{testimonials[0].text}</p>
                                            <div className="text-yellow-400 text-xs mt-1">{'★'.repeat(testimonials[0].rating)}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple icon placeholders for missing lucide-react icons
const Star = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 10.26 24 12.52 18 18.35 19.54 27.2 12 23.6 4.46 27.2 6 18.35 0 12.52 8.91 10.26 12 2"></polygon>
    </svg>
);

const Users = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

export default HomePageEditor;
