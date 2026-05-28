"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function BlogContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      toast.error('Name and Mobile No are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/quotes/submit', {
        full_name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        comments: formData.message,
        move_type: 'Blog Lead'
      });

      if (res.data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', mobile: '', message: '' });
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#C61818] border border-gray-200 p-8 rounded-lg shadow-sm w-full">
      <h3 className="text-2xl font-bold text-white mb-6">Contact Us</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white">Name*</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded outline-none focus:border-blue-600 w-full bg-white text-gray-900"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white">Email Address</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded outline-none focus:border-blue-600 w-full bg-white text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white">Mobile No*</label>
          <input 
            type="tel" 
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded outline-none focus:border-blue-600 w-full bg-white text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white">Message</label>
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="p-3 border border-gray-300 rounded outline-none focus:border-blue-600 w-full bg-white resize-y text-gray-900"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-2 bg-[#06056C] hover:bg-blue-900 text-white font-bold py-3 px-6 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
