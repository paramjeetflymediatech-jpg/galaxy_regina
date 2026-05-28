"use client";
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 10;

const emptyForm = {
  title: '',
  slug: '',
  short_description: '',
  content: '',
  icon: '',
  image_url: '',
  meta_title: '',
  meta_description: '',
  faqs: [],
};

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const ServiceManagement = forwardRef(({ onFormStateChange }, ref) => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await axios.get('/api/admin/services');
      setServices(res.data.services || []);
    } catch (e) {
      toast.error('Failed to load services');
    }
  };

  useEffect(() => { fetchServices(); }, []);

  useImperativeHandle(ref, () => ({
    openNewService: openNew
  }));

  useEffect(() => {
    if (onFormStateChange) {
      onFormStateChange(showForm);
    }
  }, [showForm, onFormStateChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !editingId ? { slug: slugify(value) } : {}),
    }));
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (svc) => {
    let parsedFaqs = [];
    if (svc.faqs) {
      try { parsedFaqs = typeof svc.faqs === 'string' ? JSON.parse(svc.faqs) : svc.faqs; }
      catch (e) { parsedFaqs = []; }
    }
    setForm({
      title: svc.title || '',
      slug: svc.slug || '',
      short_description: svc.short_description || '',
      content: svc.content || '',
      faqs: parsedFaqs,
      icon: svc.icon || '',
      image_url: svc.image_url || '',
      meta_title: svc.meta_title || '',
      meta_description: svc.meta_description || '',
    });
    setEditingId(svc.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const addFaq = () => setForm(prev => ({ ...prev, faqs: [...(prev.faqs || []), { q: '', a: '' }] }));
  const updateFaq = (index, field, value) => {
    const newFaqs = [...(form.faqs || [])];
    newFaqs[index][field] = value;
    setForm(prev => ({ ...prev, faqs: newFaqs }));
  };
  const removeFaq = (index) => {
    const newFaqs = [...(form.faqs || [])];
    newFaqs.splice(index, 1);
    setForm(prev => ({ ...prev, faqs: newFaqs }));
  };

  const saveService = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Title and slug are required');
      return;
    }
    setSaving(true);
    const payload = { ...form, faqs: JSON.stringify(form.faqs || []) };
    try {
      if (editingId) {
        await axios.put(`/api/admin/services/${editingId}`, payload);
        toast.success('Service updated successfully');
      } else {
        await axios.post('/api/admin/services', payload);
        toast.success('Service created successfully');
      }
      closeForm();
      fetchServices();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Service?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#CC0336',
      cancelButtonColor: '#06056C',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`/api/admin/services/${id}`);
      toast.success('Service deleted');
      fetchServices();
    } catch (e) {
      toast.error('Failed to delete service');
    }
  };

  const toggleActive = async (svc) => {
    try {
      await axios.patch(`/api/admin/services/${svc.id}`, { is_active: !svc.is_active });
      toast.success(`Service ${svc.is_active ? 'deactivated' : 'activated'}`);
      fetchServices();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const filteredServices = services.filter(s =>
    (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.slug || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginated = filteredServices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const inputCls = "w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* FORM */}
      {showForm && (
        <div className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col gap-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Configure New Service
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">Service Name</label>
              <input className={inputCls} name="title" value={form.title} onChange={handleChange} placeholder="e.g. Residential Moving" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">URL Slug</label>
              <input className={inputCls} name="slug" value={form.slug} onChange={handleChange} placeholder="e.g. residential-moving" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Short Description (Card Teaser)</label>
            <textarea className={inputCls} name="short_description" value={form.short_description} onChange={handleChange} rows={3} placeholder="A brief, engaging 2-sentence teaser explaining what the service handles..." />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Landing Page Content (HTML Rich Text)</label>
            <textarea className={inputCls} name="content" value={form.content} onChange={handleChange} rows={6} placeholder="Full service page HTML content..." />
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold text-gray-900">Service FAQ Schema Builder</h3>
            {form.faqs && form.faqs.map((faq, idx) => (
              <div key={idx} className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                <button onClick={() => removeFaq(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1">
                  <FiTrash2 size={16} />
                </button>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700">Question</label>
                  <input className={inputCls} value={faq.q} onChange={(e) => updateFaq(idx, 'q', e.target.value)} placeholder="e.g. Do you handle piano moves?" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700">Answer text</label>
                  <textarea className={inputCls} value={faq.a} onChange={(e) => updateFaq(idx, 'a', e.target.value)} rows={2} placeholder="Answer text..." />
                </div>
              </div>
            ))}
            <button onClick={addFaq} className="w-fit text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <FiPlus /> Add
            </button>
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={closeForm} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-200">
              Cancel Changes
            </button>
            <button
              onClick={saveService}
              disabled={saving}
              className="bg-[#06056C] hover:bg-blue-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      {!showForm && (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-500 hidden md:block">
                {filteredServices.length} found ({services.length} total)
              </span>
            </div>
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                  <th className="py-4 px-6 font-semibold">Icon</th>
                  <th className="py-4 px-6 font-semibold">Title</th>
                  <th className="py-4 px-6 font-semibold">Slug</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((svc, idx) => (
                  <tr key={svc.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="py-4 px-6 text-xl">{svc.icon || '⚙️'}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900">{svc.title}</td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">/{svc.slug}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${svc.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {svc.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => toggleActive(svc)}
                          title={svc.is_active ? 'Deactivate' : 'Activate'}
                          className="bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-orange-500 p-2 rounded-lg transition-all shadow-sm"
                        >
                          {svc.is_active ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                        </button>
                        <button
                          onClick={() => openEdit(svc)}
                          title="Edit"
                          className="bg-white border border-gray-200 hover:border-[#06056C] hover:bg-[#06056C] hover:text-white text-[#06056C] p-2 rounded-lg transition-all shadow-sm"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteService(svc.id)}
                          title="Delete"
                          className="bg-white border border-gray-200 hover:border-[#CC0336] hover:bg-[#CC0336] hover:text-white text-[#CC0336] p-2 rounded-lg transition-all shadow-sm"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginated.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                <p className="font-semibold text-gray-500">No services found.</p>
                <p className="text-xs mt-1">Click "Create Service" to add your first service.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <span className="text-sm text-gray-500">
                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredServices.length)}</span> of{' '}
                <span className="font-medium">{filteredServices.length}</span> services
              </span>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default ServiceManagement;
