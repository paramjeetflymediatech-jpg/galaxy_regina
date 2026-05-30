import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiMapPin, FiImage, FiFileText, FiSearch, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import RichTextEditor from '../components/RichTextEditor/RichTextEditor';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 10;

const LocationManagement = forwardRef(({ onFormStateChange }, ref) => {
    const [activeTab, setActiveTab] = useState('provinces'); // 'provinces', 'districts', 'cities'
    
    // UI States
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Provinces
    const [provinces, setProvinces] = useState([]);
    const [provinceForm, setProvinceForm] = useState({ id: null, name: '', slug: '' });

    // Districts
    const [districts, setDistricts] = useState([]);
    const [districtForm, setDistrictForm] = useState({ id: null, name: '', slug: '', province_id: '' });

    // Cities (Locations)
    const [locations, setLocations] = useState([]);
    const [locationForm, setLocationForm] = useState({
        id: null, location_name: '', province_id: '', district_id: '',
        hero_title: '', hero_subtitle: '', content: '',
        meta_title: '', meta_description: '', meta_keywords: ''
    });
    const [image, setImage] = useState(null);

    // Service Locations
    const [serviceLocations, setServiceLocations] = useState([]);
    const [services, setServices] = useState([]);
    const [serviceLocationForm, setServiceLocationForm] = useState({
        id: null, service_id: '', location_id: '', content: '', description: '',
        faqs: [{ q: '', a: '' }],
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        canonical_url: '',
        og_title: '',
        og_description: '',
        og_image: '',
        header_scripts: '',
        footer_scripts: '',
    });

    useEffect(() => {
        fetchProvinces();
        fetchDistricts();
        fetchLocations();
        fetchServices();
        fetchServiceLocations();
    }, []);

    useImperativeHandle(ref, () => ({
        openNew: () => {
            if (activeTab === 'provinces') openNewProvince();
            else if (activeTab === 'districts') openNewDistrict();
            else if (activeTab === 'cities') openNewLocation();
            else if (activeTab === 'service_locations') openNewServiceLocation();
        }
    }));

    useEffect(() => {
        if (onFormStateChange) {
            onFormStateChange({ showForm, activeTab });
        }
    }, [showForm, activeTab, onFormStateChange]);

    const fetchProvinces = async () => { try { const res = await axios.get('/api/provinces'); setProvinces(res.data.provinces || []); } catch (e) { console.error(e); } };
    const fetchDistricts = async () => { try { const res = await axios.get('/api/districts'); setDistricts(res.data.districts || []); } catch (e) { console.error(e); } };
    const fetchLocations = async () => { try { const res = await axios.get('/api/locations'); setLocations(res.data.locations || []); } catch (e) { console.error(e); } };
    const fetchServices = async () => { try { const res = await axios.get('/api/services'); setServices(res.data.services || []); } catch (e) { console.error(e); } };
    const fetchServiceLocations = async () => { try { const res = await axios.get('/api/service-locations'); setServiceLocations(res.data.serviceLocations || []); } catch (e) { console.error(e); } };

    const switchTab = (tab) => {
        setActiveTab(tab);
        setShowForm(false);
        setEditing(false);
        setSearchQuery('');
        setCurrentPage(1);
    };

    // --- FILTER & PAGINATION LOGIC ---
    const filteredProvinces = useMemo(() => provinces.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase())), [provinces, searchQuery]);
    const paginatedProvinces = filteredProvinces.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const filteredDistricts = useMemo(() => districts.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.slug.toLowerCase().includes(searchQuery.toLowerCase())), [districts, searchQuery]);
    const paginatedDistricts = filteredDistricts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const filteredLocations = useMemo(() => locations.filter(l => l.location_name.toLowerCase().includes(searchQuery.toLowerCase()) || l.slug.toLowerCase().includes(searchQuery.toLowerCase())), [locations, searchQuery]);
    const paginatedLocations = filteredLocations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const filteredServiceLocations = useMemo(() => {
        return serviceLocations.filter(sl => {
            const locName = sl.location?.location_name || '';
            const serviceTitle = sl.service?.title || '';
            const query = searchQuery.toLowerCase();
            return locName.toLowerCase().includes(query) || serviceTitle.toLowerCase().includes(query);
        });
    }, [serviceLocations, searchQuery]);
    const paginatedServiceLocations = filteredServiceLocations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const totalPages = Math.ceil(
        (activeTab === 'provinces' ? filteredProvinces.length : 
         activeTab === 'districts' ? filteredDistricts.length : 
         activeTab === 'cities' ? filteredLocations.length : 
         filteredServiceLocations.length) / ITEMS_PER_PAGE
    );

    // --- PROVINCE ACTIONS ---
    const handleProvinceChange = (e) => setProvinceForm({ ...provinceForm, [e.target.name]: e.target.value });
    const saveProvince = async () => {
        if (!provinceForm.name || !provinceForm.slug) return toast.error("Name and slug are required");
        try {
            if (provinceForm.id) {
                await axios.put(`/api/provinces/${provinceForm.id}`, provinceForm);
                toast.success("Province Updated!");
            } else {
                await axios.post('/api/provinces', provinceForm);
                toast.success("Province Added!");
            }
            setShowForm(false);
            fetchProvinces();
        } catch (err) { toast.error("Error saving province"); }
    };
    const openNewProvince = () => { setProvinceForm({id:null, name:'', slug:''}); setEditing(false); setShowForm(true); };
    const editProvinceHandler = (p) => { setProvinceForm(p); setEditing(true); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const deleteProvince = async (id) => {
        const result = await Swal.fire({ title: 'Delete Province?', text: 'This action cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#CC0336', cancelButtonColor: '#06056C', confirmButtonText: 'Yes, delete it', cancelButtonText: 'Cancel' });
        if (!result.isConfirmed) return;
        try { await axios.delete(`/api/provinces/${id}`); toast.success("Deleted!"); fetchProvinces(); } catch (e) { toast.error("Error deleting"); }
    };

    // --- DISTRICT ACTIONS ---
    const handleDistrictChange = (e) => setDistrictForm({ ...districtForm, [e.target.name]: e.target.value });
    const saveDistrict = async () => {
        if (!districtForm.name || !districtForm.slug || !districtForm.province_id) return toast.error("All fields required");
        try {
            if (districtForm.id) {
                await axios.put(`/api/districts/${districtForm.id}`, districtForm);
                toast.success("Region Updated!");
            } else {
                await axios.post('/api/districts', districtForm);
                toast.success("Region Added!");
            }
            setShowForm(false);
            fetchDistricts();
        } catch (err) { toast.error("Error saving region"); }
    };
    const openNewDistrict = () => { setDistrictForm({id:null, name:'', slug:'', province_id:''}); setEditing(false); setShowForm(true); };
    const editDistrictHandler = (d) => { setDistrictForm(d); setEditing(true); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const deleteDistrict = async (id) => {
        const result = await Swal.fire({ title: 'Delete District?', text: 'This action cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#CC0336', cancelButtonColor: '#06056C', confirmButtonText: 'Yes, delete it', cancelButtonText: 'Cancel' });
        if (!result.isConfirmed) return;
        try { await axios.delete(`/api/districts/${id}`); toast.success("Deleted!"); fetchDistricts(); } catch (e) { toast.error("Error deleting"); }
    };

    // --- CITY ACTIONS ---
    const handleLocationChange = (e) => setLocationForm({ ...locationForm, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setImage(e.target.files[0]);
    const saveLocation = async () => {
        if (!locationForm.location_name) return toast.error('City name required');
        const data = new FormData();
        Object.keys(locationForm).forEach(key => { if(locationForm[key]) data.append(key, locationForm[key]) });
        if (image) data.append("image", image);

        try {
            if (locationForm.id) {
                await axios.put(`/api/locations/${locationForm.id}`, data);
                toast.success("City Updated!");
            } else {
                await axios.post('/api/locations/add', data);
                toast.success("City Added!");
            }
            setShowForm(false);
            fetchLocations();
        } catch (error) { toast.error("Error saving city"); }
    };
    const openNewLocation = () => { setLocationForm({id:null, location_name:'', province_id:'', district_id:'', hero_title:'', hero_subtitle:'', content:'', meta_title:'', meta_description:'', meta_keywords:''}); setImage(null); setEditing(false); setShowForm(true); };
    const editLocationHandler = (loc) => {
        setLocationForm({
            id: loc.id, location_name: loc.location_name || '', province_id: loc.province_id || '', district_id: loc.district_id || '',
            hero_title: loc.hero_title || '', hero_subtitle: loc.hero_subtitle || '', content: loc.content || '',
            meta_title: loc.meta_title || '', meta_description: loc.meta_description || '', meta_keywords: loc.meta_keywords || '',
        });
        setImage(null);
        setEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const deleteLocation = async (id) => {
        const result = await Swal.fire({ title: 'Delete City?', text: 'This action cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#CC0336', cancelButtonColor: '#06056C', confirmButtonText: 'Yes, delete it', cancelButtonText: 'Cancel' });
        if (!result.isConfirmed) return;
        try { await axios.delete(`/api/locations/${id}`); toast.success("Deleted!"); fetchLocations(); } catch (e) { toast.error("Error deleting"); }
    };

    // --- SERVICE LOCATION ACTIONS ---
    const handleServiceLocationChange = (e) => setServiceLocationForm({ ...serviceLocationForm, [e.target.name]: e.target.value });
    
    const handleSLFaqChange = (index, field, value) => {
        const updatedFaqs = [...serviceLocationForm.faqs];
        updatedFaqs[index][field] = value;
        setServiceLocationForm({ ...serviceLocationForm, faqs: updatedFaqs });
    };

    const addSLFaq = () => {
        setServiceLocationForm({
            ...serviceLocationForm,
            faqs: [...serviceLocationForm.faqs, { q: '', a: '' }]
        });
    };

    const removeSLFaq = (index) => {
        const updatedFaqs = serviceLocationForm.faqs.filter((_, i) => i !== index);
        setServiceLocationForm({ ...serviceLocationForm, faqs: updatedFaqs });
    };

    const saveServiceLocation = async () => {
        const { service_id, location_id } = serviceLocationForm;
        if (!service_id || !location_id) return toast.error("Service and City selection are required");

        const cleanFaqs = serviceLocationForm.faqs.filter(faq => faq.q.trim() && faq.a.trim());

        const payload = {
            ...serviceLocationForm,
            faqs: cleanFaqs
        };

        try {
            if (serviceLocationForm.id) {
                await axios.put(`/api/service-locations/${serviceLocationForm.id}`, payload);
                toast.success("Service Location Updated!");
            } else {
                await axios.post('/api/service-locations', payload);
                toast.success("Service Location Added!");
            }

            // Save SEO data to the Seo table
            const service = services.find(s => s.id === parseInt(service_id, 10));
            const location = locations.find(l => l.id === parseInt(location_id, 10));
            if (service && location) {
                const page_path = `/location/${service.slug}-in-${location.slug}`;
                const seoPayload = {
                    page_path,
                    title: serviceLocationForm.meta_title || '',
                    description: serviceLocationForm.meta_description || '',
                    keywords: serviceLocationForm.meta_keywords || '',
                    canonical_url: serviceLocationForm.canonical_url || '',
                    og_title: serviceLocationForm.og_title || '',
                    og_description: serviceLocationForm.og_description || '',
                    og_image: serviceLocationForm.og_image || '',
                    header_scripts: serviceLocationForm.header_scripts || '',
                    footer_scripts: serviceLocationForm.footer_scripts || '',
                    faqs: cleanFaqs
                };
                try {
                    await axios.post('/api/admin/seo', seoPayload);
                } catch (seoErr) {
                    console.error("Failed to save SEO metadata:", seoErr);
                }
            }

            setShowForm(false);
            fetchServiceLocations();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error saving service location");
        }
    };

    const openNewServiceLocation = () => {
        setServiceLocationForm({
            id: null,
            service_id: '',
            location_id: '',
            content: '',
            description: '',
            faqs: [{ q: '', a: '' }],
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
            canonical_url: '',
            og_title: '',
            og_description: '',
            og_image: '',
            header_scripts: '',
            footer_scripts: '',
        });
        setEditing(false);
        setShowForm(true);
    };

    const editServiceLocationHandler = async (sl) => {
        let parsedFaqs = [{ q: '', a: '' }];
        if (sl.faqs) {
            try {
                parsedFaqs = typeof sl.faqs === 'string' ? JSON.parse(sl.faqs) : sl.faqs;
                if (!Array.isArray(parsedFaqs) || parsedFaqs.length === 0) {
                    parsedFaqs = [{ q: '', a: '' }];
                }
            } catch (e) {
                parsedFaqs = [{ q: '', a: '' }];
            }
        }

        const initialForm = {
            id: sl.id,
            service_id: sl.service_id || '',
            location_id: sl.location_id || '',
            content: sl.content || '',
            description: sl.description || '',
            faqs: parsedFaqs,
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
            canonical_url: '',
            og_title: '',
            og_description: '',
            og_image: '',
            header_scripts: '',
            footer_scripts: '',
        };

        setServiceLocationForm(initialForm);
        setEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Load SEO data from API asynchronously
        const service = services.find(s => s.id === sl.service_id);
        const location = locations.find(l => l.id === sl.location_id);
        if (service && location) {
            const page_path = `/location/${service.slug}-in-${location.slug}`;
            try {
                const seoRes = await axios.get(`/api/admin/seo?page_path=${encodeURIComponent(page_path)}`);
                if (seoRes.data.success && seoRes.data.seo) {
                    const seo = seoRes.data.seo;
                    setServiceLocationForm(prev => {
                        // Avoid updating if user edited a different item during query
                        if (prev.id !== sl.id) return prev;
                        return {
                            ...prev,
                            meta_title: seo.title || '',
                            meta_description: seo.description || '',
                            meta_keywords: seo.keywords || '',
                            canonical_url: seo.canonical_url || '',
                            og_title: seo.og_title || '',
                            og_description: seo.og_description || '',
                            og_image: seo.og_image || '',
                            header_scripts: seo.header_scripts || '',
                            footer_scripts: seo.footer_scripts || '',
                        };
                    });
                }
            } catch (err) {
                console.error("Failed to load SEO metadata for service location:", err);
            }
        }
    };

    const deleteServiceLocation = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Service Location?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#CC0336',
            cancelButtonColor: '#06056C',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        });
        if (!result.isConfirmed) return;
        try {
            await axios.delete(`/api/service-locations/${id}`);
            toast.success("Deleted!");
            fetchServiceLocations();
        } catch (e) {
            toast.error("Error deleting");
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div>
                
                
                {/* TABS */}
                <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                    <button onClick={() => switchTab('provinces')} className={`py-3 px-6 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'provinces' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Provinces & States</button>
                    <button onClick={() => switchTab('districts')} className={`py-3 px-6 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'districts' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Districts & Regions</button>
                    <button onClick={() => switchTab('cities')} className={`py-3 px-6 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'cities' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Cities & Locations</button>
                    <button onClick={() => switchTab('service_locations')} className={`py-3 px-6 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'service_locations' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Service Locations</button>
                </div>

                {/* --- PROVINCES TAB --- */}
                {activeTab === 'provinces' && (
                    <div className="flex flex-col gap-6">
                        {showForm && (
                            <div className="bg-white border border-gray-200 p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">{editing ? "Edit Province" : "Configure New Province"}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">Province/State Name *</label>
                                        <input type="text" name="name" placeholder="e.g. Ontario" value={provinceForm.name} onChange={handleProvinceChange} className="border border-gray-300 p-3 text-sm outline-none w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">URL Slug *</label>
                                        <input type="text" name="slug" placeholder="e.g. ontario" value={provinceForm.slug} onChange={handleProvinceChange} className="border border-gray-300 p-3 text-sm outline-none w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={saveProvince} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 transition-colors">{editing ? "Update Province" : "Save Province"}</button>
                                    <button onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 font-semibold py-3 px-6 transition-colors">Cancel</button>
                                </div>
                            </div>
                        )}

                        {!showForm && (
                            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                                <div className="p-6 md:p-8 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-500 hidden md:block">
                                            {filteredProvinces.length} found ({provinces.length} total)
                                        </span>
                                    </div>
                                    <div className="relative w-full sm:w-80">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input 
                                            type="text" 
                                            placeholder="Search provinces..." 
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                                            <th className="py-4 px-6 font-semibold">Province Name</th>
                                            <th className="py-4 px-6 font-semibold">URL Slug</th>
                                            <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedProvinces.map((p, idx) => (
                                            <tr key={p.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="py-4 px-6 font-medium text-gray-900">{p.name}</td>
                                                <td className="py-4 px-6">
                                                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">/province/{p.slug}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-end items-center gap-2">
                                                        <button onClick={() => editProvinceHandler(p)} title="Edit Province" className="bg-white border border-gray-200 hover:border-[#06056C] hover:bg-[#06056C] hover:text-white text-[#06056C] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"><FiEdit2 size={16} /></button>
                                                        <button onClick={() => deleteProvince(p.id)} title="Delete Province" className="bg-white border border-gray-200 hover:border-[#CC0336] hover:bg-[#CC0336] hover:text-white text-[#CC0336] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"><FiTrash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {paginatedProvinces.length === 0 && <div className="p-10 text-center text-gray-500">No provinces found.</div>}
                                </div>
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                                        <span className="text-sm text-gray-500">
                                            Showing <span className="font-medium">{filteredProvinces.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProvinces.length)}</span> of <span className="font-medium">{filteredProvinces.length}</span> provinces
                                        </span>
                                        <div className="flex gap-2">
                                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                                            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* --- DISTRICTS TAB --- */}
                {activeTab === 'districts' && (
                    <div className="flex flex-col gap-6">
                        {showForm && (
                            <div className="bg-white border border-gray-200 p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">{editing ? "Edit Region" : "Configure New Region/District"}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">Region/District Name *</label>
                                        <input type="text" name="name" placeholder="e.g. Greater Toronto Area" value={districtForm.name} onChange={handleDistrictChange} className="border border-gray-300 p-3 text-sm outline-none w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">URL Slug *</label>
                                        <input type="text" name="slug" placeholder="e.g. greater-toronto" value={districtForm.slug} onChange={handleDistrictChange} className="border border-gray-300 p-3 text-sm outline-none w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">Parent Province/State *</label>
                                        <select name="province_id" value={districtForm.province_id} onChange={handleDistrictChange} className="border border-gray-300 p-3 text-sm outline-none w-full bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
                                            <option value="">Select Province...</option>
                                            {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={saveDistrict} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 transition-colors">{editing ? "Update Region" : "Save Region"}</button>
                                    <button onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 font-semibold py-3 px-6 transition-colors">Cancel</button>
                                </div>
                            </div>
                        )}

                        {!showForm && (
                            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                                <div className="p-6 md:p-8 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-500 hidden md:block">
                                            {filteredDistricts.length} found ({districts.length} total)
                                        </span>
                                    </div>
                                    <div className="relative w-full sm:w-80">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input 
                                            type="text" 
                                            placeholder="Search regions..." 
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                                            <th className="py-4 px-6 font-semibold">Region Name</th>
                                            <th className="py-4 px-6 font-semibold">Parent Province</th>
                                            <th className="py-4 px-6 font-semibold">URL Slug</th>
                                            <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedDistricts.map((d, idx) => (
                                            <tr key={d.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="py-4 px-6 font-medium text-gray-900">{d.name}</td>
                                                <td className="py-4 px-6 text-sm text-gray-600">{d.province?.name || provinces.find(p => p.id === d.province_id)?.name}</td>
                                                <td className="py-4 px-6">
                                                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">/region/{d.slug}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-end items-center gap-2">
                                                        <button onClick={() => editDistrictHandler(d)} title="Edit Region" className="bg-white border border-gray-200 hover:border-[#06056C] hover:bg-[#06056C] hover:text-white text-[#06056C] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"><FiEdit2 size={16} /></button>
                                                        <button onClick={() => deleteDistrict(d.id)} title="Delete Region" className="bg-white border border-gray-200 hover:border-[#CC0336] hover:bg-[#CC0336] hover:text-white text-[#CC0336] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"><FiTrash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {paginatedDistricts.length === 0 && <div className="p-10 text-center text-gray-500">No regions found.</div>}
                                </div>
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                                        <span className="text-sm text-gray-500">
                                            Showing <span className="font-medium">{filteredDistricts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredDistricts.length)}</span> of <span className="font-medium">{filteredDistricts.length}</span> regions
                                        </span>
                                        <div className="flex gap-2">
                                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                                            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* --- CITIES TAB --- */}
                {activeTab === 'cities' && (
                    <div className="flex flex-col gap-6">
                        {showForm && (
                            <div className="bg-white border border-gray-200 p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">{editing ? "Edit City/Location" : "Configure New City/Location"}</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">City Name *</label>
                                        <input type="text" name="location_name" placeholder="e.g. Toronto" value={locationForm.location_name} onChange={handleLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">Province / State</label>
                                        <select name="province_id" value={locationForm.province_id} onChange={handleLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
                                            <option value="">None</option>
                                            {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">Region / District</label>
                                        <select name="district_id" value={locationForm.district_id} onChange={handleLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
                                            <option value="">None</option>
                                            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">Hero Title</label>
                                        <input type="text" name="hero_title" placeholder="Hero Title" value={locationForm.hero_title} onChange={handleLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">Hero Subtitle</label>
                                        <textarea name="hero_subtitle" placeholder="Hero Subtitle" value={locationForm.hero_subtitle} onChange={handleLocationChange} rows={2} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full resize-y focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mb-6">
                                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2"><FiFileText /> Main Content (HTML)</label>
                                    <RichTextEditor value={locationForm.content} onChange={(val) => setLocationForm({ ...locationForm, content: val })} placeholder="City content..." />
                                </div>

                                <div className="border-t border-gray-200 pt-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Metadata</h3>
                                    <div className="flex flex-col gap-4">
                                        <input type="text" name="meta_title" placeholder="Meta Title" value={locationForm.meta_title} onChange={handleLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                        <textarea name="meta_description" placeholder="Meta Description" value={locationForm.meta_description} onChange={handleLocationChange} rows={2} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full resize-y focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                        <input type="text" name="meta_keywords" placeholder="Meta Keywords" value={locationForm.meta_keywords} onChange={handleLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6 mb-6">
                                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3"><FiImage /> Background Image</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:bg-gray-50 hover:file:bg-gray-100" />
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={saveLocation} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 transition-colors">{editing ? "Update City" : "Save City"}</button>
                                    <button onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 font-semibold py-3 px-6 transition-colors">Cancel</button>
                                </div>
                            </div>
                        )}

                        {!showForm && (
                            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                                <div className="p-6 md:p-8 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-500 hidden md:block">
                                            {filteredLocations.length} found ({locations.length} total)
                                        </span>
                                    </div>
                                    <div className="relative w-full sm:w-80">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input 
                                            type="text" 
                                            placeholder="Search cities..." 
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                                            <th className="py-4 px-6 font-semibold">City Details</th>
                                            <th className="py-4 px-6 font-semibold">Parent Region / Province</th>
                                            <th className="py-4 px-6 font-semibold">URL Slug</th>
                                            <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedLocations.map((loc, idx) => (
                                            <tr key={loc.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        {loc.image_url ? (
                                                            <img src={loc.image_url.startsWith('http') ? loc.image_url : `/uploads/${loc.image_url}`} alt={loc.location_name} className="w-16 h-12 rounded object-cover border border-gray-200 shrink-0" />
                                                        ) : (
                                                            <div className="w-16 h-12 rounded bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0">
                                                                <FiImage size={20} className="text-gray-300" />
                                                            </div>
                                                        )}
                                                        <span className="font-medium text-gray-900">{loc.location_name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">
                                                    <div className="flex flex-col gap-0.5">
                                                        {loc.district_id && <span>{districts.find(d => d.id === loc.district_id)?.name}</span>}
                                                        {loc.province_id && <span className="text-xs text-gray-400">{provinces.find(p => p.id === loc.province_id)?.name}</span>}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">/location/{loc.slug}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-end items-center gap-2">
                                                        <button onClick={() => editLocationHandler(loc)} title="Edit City" className="bg-white border border-gray-200 hover:border-[#06056C] hover:bg-[#06056C] hover:text-white text-[#06056C] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"><FiEdit2 size={16} /></button>
                                                        <button onClick={() => deleteLocation(loc.id)} title="Delete City" className="bg-white border border-gray-200 hover:border-[#CC0336] hover:bg-[#CC0336] hover:text-white text-[#CC0336] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"><FiTrash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {paginatedLocations.length === 0 && <div className="p-10 text-center text-gray-500">No cities found.</div>}
                                </div>
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                                        <span className="text-sm text-gray-500">
                                            Showing <span className="font-medium">{filteredLocations.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredLocations.length)}</span> of <span className="font-medium">{filteredLocations.length}</span> cities
                                        </span>
                                        <div className="flex gap-2">
                                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                                            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* --- SERVICE LOCATIONS TAB --- */}
                {activeTab === 'service_locations' && (
                    <div className="flex flex-col gap-6">
                        {showForm && (
                            <div className="bg-white border border-gray-200 p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">{editing ? "Edit Service Location" : "Configure New Service Location"}</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">Service *</label>
                                        <select name="service_id" value={serviceLocationForm.service_id} onChange={handleServiceLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" disabled={editing}>
                                            <option value="">Select Service...</option>
                                            {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-900">City/Location *</label>
                                        <select name="location_id" value={serviceLocationForm.location_id} onChange={handleServiceLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" disabled={editing}>
                                            <option value="">Select City/Location...</option>
                                            {locations.map(l => <option key={l.id} value={l.id}>{l.location_name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mb-6">
                                    <label className="text-sm font-semibold text-gray-900">Description / Subtitle</label>
                                    <textarea name="description" placeholder="Short description or subtitle for this service in this location..." value={serviceLocationForm.description} onChange={handleServiceLocationChange} rows={2} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full resize-y focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                </div>

                                <div className="flex flex-col gap-2 mb-6">
                                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2"><FiFileText /> Service Location Content (HTML)</label>
                                    <RichTextEditor value={serviceLocationForm.content} onChange={(val) => setServiceLocationForm({ ...serviceLocationForm, content: val })} placeholder="Specific content for this service location..." />
                                </div>

                                <div className="border-t border-gray-200 pt-6 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions (FAQs)</h3>
                                        <button onClick={addSLFaq} type="button" className="bg-gray-100 hover:bg-gray-200 text-[#06056C] font-semibold py-1.5 px-4 text-xs border border-gray-200 rounded flex items-center gap-1.5 transition-colors"><FiPlus /> Add FAQ</button>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {serviceLocationForm.faqs.map((faq, index) => (
                                            <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg relative">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-semibold text-gray-700">Question #{index + 1}</label>
                                                    <input type="text" placeholder="e.g. What services do you offer?" value={faq.q} onChange={(e) => handleSLFaqChange(index, 'q', e.target.value)} className="border border-gray-300 p-2.5 text-xs outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-semibold text-gray-700">Answer #{index + 1}</label>
                                                    <textarea placeholder="e.g. We offer residential, commercial..." value={faq.a} onChange={(e) => handleSLFaqChange(index, 'a', e.target.value)} rows={2} className="border border-gray-300 p-2.5 text-xs outline-none bg-white w-full resize-y focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                                </div>
                                                {serviceLocationForm.faqs.length > 1 && (
                                                    <button onClick={() => removeSLFaq(index)} type="button" className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 text-xs font-bold transition-colors">Remove</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Metadata Customizer</h3>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-900">Meta Title Tag</label>
                                            <input type="text" name="meta_title" placeholder="Meta Title..." value={serviceLocationForm.meta_title} onChange={handleServiceLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-900">Meta Description</label>
                                            <textarea name="meta_description" placeholder="Meta Description..." value={serviceLocationForm.meta_description} onChange={handleServiceLocationChange} rows={3} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full resize-y focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-900">Meta Keywords (comma separated)</label>
                                            <input type="text" name="meta_keywords" placeholder="Keywords..." value={serviceLocationForm.meta_keywords} onChange={handleServiceLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-900">Canonical URL</label>
                                            <input type="text" name="canonical_url" placeholder="https://example.com/..." value={serviceLocationForm.canonical_url} onChange={handleServiceLocationChange} className="border border-gray-300 p-3 text-sm outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                        </div>

                                        <h4 className="text-sm font-bold text-gray-900 mt-2">OpenGraph Social Meta</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-semibold text-gray-700">OG Title</label>
                                                <input type="text" name="og_title" placeholder="OG Title..." value={serviceLocationForm.og_title} onChange={handleServiceLocationChange} className="border border-gray-300 p-2.5 text-xs outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-semibold text-gray-700">OG Image URL</label>
                                                <input type="text" name="og_image" placeholder="OG Image URL..." value={serviceLocationForm.og_image} onChange={handleServiceLocationChange} className="border border-gray-300 p-2.5 text-xs outline-none bg-white w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700">OG Description</label>
                                            <textarea name="og_description" placeholder="OG Description..." value={serviceLocationForm.og_description} onChange={handleServiceLocationChange} rows={2} className="border border-gray-300 p-2.5 text-xs outline-none bg-white w-full resize-y focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                        </div>

                                        <h4 className="text-sm font-bold text-gray-900 mt-2">Analytics & Injection Scripts</h4>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700">Header Scripts (inside &lt;head&gt;)</label>
                                            <textarea name="header_scripts" placeholder="Header Injection..." value={serviceLocationForm.header_scripts} onChange={handleServiceLocationChange} rows={3} className="border border-gray-300 p-2.5 text-xs font-mono outline-none bg-white w-full resize-y focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700">Footer Scripts (before closing &lt;/body&gt;)</label>
                                            <textarea name="footer_scripts" placeholder="Footer Injection..." value={serviceLocationForm.footer_scripts} onChange={handleServiceLocationChange} rows={3} className="border border-gray-300 p-2.5 text-xs font-mono outline-none bg-white w-full resize-y focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={saveServiceLocation} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 transition-colors">{editing ? "Update" : "Save"}</button>
                                    <button onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 font-semibold py-3 px-6 transition-colors">Cancel</button>
                                </div>
                            </div>
                        )}

                        {!showForm && (
                            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                                <div className="p-6 md:p-8 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-500 hidden md:block">
                                            {filteredServiceLocations.length} found ({serviceLocations.length} total)
                                        </span>
                                    </div>
                                    <div className="relative w-full sm:w-80">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input 
                                            type="text" 
                                            placeholder="Search service locations..." 
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                                                <th className="py-4 px-6 font-semibold">Service</th>
                                                <th className="py-4 px-6 font-semibold">City/Location</th>
                                                <th className="py-4 px-6 font-semibold">Description</th>
                                                <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedServiceLocations.map((sl, idx) => (
                                                <tr key={sl.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                    <td className="py-4 px-6 font-semibold text-gray-900">{sl.service?.title || `Service ID: ${sl.service_id}`}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-700">{sl.location?.location_name || `Location ID: ${sl.location_id}`}</td>
                                                    <td className="py-4 px-6 text-xs text-gray-500 max-w-xs truncate">{sl.description || 'No description'}</td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex justify-end items-center gap-2">
                                                            <button onClick={() => editServiceLocationHandler(sl)} title="Edit Service Location" className="bg-white border border-gray-200 hover:border-[#06056C] hover:bg-[#06056C] hover:text-white text-[#06056C] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"><FiEdit2 size={16} /></button>
                                                            <button onClick={() => deleteServiceLocation(sl.id)} title="Delete Service Location" className="bg-white border border-gray-200 hover:border-[#CC0336] hover:bg-[#CC0336] hover:text-white text-[#CC0336] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"><FiTrash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {paginatedServiceLocations.length === 0 && <div className="p-10 text-center text-gray-500">No service locations found.</div>}
                                </div>
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                                        <span className="text-sm text-gray-500">
                                            Showing <span className="font-medium">{filteredServiceLocations.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredServiceLocations.length)}</span> of <span className="font-medium">{filteredServiceLocations.length}</span> service locations
                                        </span>
                                        <div className="flex gap-2">
                                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                                            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
});

export default LocationManagement;