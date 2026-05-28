"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AdminSignup = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        '/api/admin/signup',
        formData
      );

      if (response.data.success) {
        toast.success('Signup successful. Please login.');
        router.push('/admin/login');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Signup failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <div className="bg-white border border-gray-200 p-8 md:p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Signup</h1>
        <p className="text-gray-500 mb-8 text-sm">Create your admin account to manage the website.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors mt-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account? <a href="/admin/login" className="text-blue-600 font-medium hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
