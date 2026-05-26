"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import '../../../src/AdminDashboard/css/AdminLogin.css';

const AdminLogin = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
                '/api/admin/login',
                formData
            );

            if (response.data.success) {

                // Save to localStorage
                localStorage.setItem(
                    'admin',
                    JSON.stringify(response.data.admin)
                );

                // Set cookie for middleware protection
                document.cookie = `admin=${JSON.stringify(response.data.admin)}; path=/; max-age=${7 * 24 * 60 * 60}`;

                alert('Login Successful');

                // Use 0ms delay to ensure cookie is set
                setTimeout(() => {
                    router.push('/admin');
                }, 100);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                'Login Failed'
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Admin Login</h1>

                <p>Login to access dashboard</p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                    >

                        {
                            loading
                                ? 'Logging in...'
                                : 'Login'
                        }

                    </button>

                </form>

                <p className="login-footer">
                    Don't have an admin account?{' '}
                    <a href="/admin/signup">Sign up</a>
                </p>

            </div>

        </div>

    );
};

export default AdminLogin;