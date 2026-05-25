"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import "./MovingCompanyWebsite.css";
import FAQ from "../FAQ/FAQ";
import Footer from "../Footer/Footer";
import PageHero from "../PageHero/PageHero";

const MovingCompanyWebsite = () => {
    const params = useParams();
    const slug = params.slug;

    const [locationData, setLocationData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        mobile: '',
        move_type: '',
        pickup_address: '',
        dropoff_address: '',
        moving_date: '',
        comments: ''
    });

    // Fetch Location Data
    useEffect(() => {
        if (!slug) return;
        fetchLocation();
    }, [slug]);

    const fetchLocation = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`http://localhost:5000/api/locations/${slug}`);

            if (response.data.success) {
                setLocationData(response.data.location || response.data.content);
            } else {
                setError("Location data not found");
            }
        } catch (err: any) {
            console.error(err);
            setError("Failed to load location content");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/quotes/submit', formData);
            alert("Quote Submitted Successfully!");
            setFormData({ full_name: '', email: '', mobile: '', move_type: '', pickup_address: '', dropoff_address: '', moving_date: '', comments: '' });
        } catch (error) {
            console.error(error);
            alert("Failed to submit quote");
        }
    };

    if (loading) return <div className="loading-container"><h2>Loading location content...</h2></div>;
    if (error) return <div className="error-container"><h2>{error}</h2></div>;
    if (!locationData) return <div className="error-container"><h2>No Location Data Found</h2></div>;

    return (
        <div className="main-container">
            {/* Hero Section with Background Image */}
<PageHero
  title={locationData?.location_name || "Galaxy Movers Regina"}
  bgImage={
    locationData?.image_url
      ? `http://localhost:5000/uploads/${locationData.image_url}`
      : "https://galaxymoversregina.ca/wp-content/uploads/2025/07/1708059691_Home-shifting.jpg"
  }
/>
            <section 
                className="hero"
             style={{
    backgroundImage: locationData.image_url 
        ? `ur[](http://localhost:5000/uploads/${locationData.image_url})` 
        : 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/default-moving-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
}}
            >
                <div className="hero-content">
                    <div className="hero-left">
                        <h1>{locationData.hero_title || "WE TREAT YOUR BELONGINGS LIKE OUR OWN"}</h1>
                        <p className="hero-desc">
                            {locationData.hero_subtitle || "Trusted movers with care and precision"}
                        </p>
                    </div>

                    {/* Quote Form */}
                    <div className="card form-card">
                        <h2 className="card-title">GET A FREE QUOTE!</h2>

                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="full_name"
                                    placeholder="Full Name"
                                    className="input"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    className="input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="Mobile"
                                    className="input"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                />
                                <select 
                                    className="input"
                                    name="move_type"
                                    value={formData.move_type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Move Type</option>
                                    <option value="1 Bedroom">1 Bedroom</option>
                                    <option value="2 Bedroom">2 Bedroom</option>
                                    <option value="3+ Bedroom">3+ Bedroom</option>
                                    <option value="Office Move">Office Move</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <input
                                    type="text"
                                    name="pickup_address"
                                    placeholder="Pickup Address"
                                    className="input"
                                    value={formData.pickup_address}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="dropoff_address"
                                    placeholder="Drop-off Address"
                                    className="input"
                                    value={formData.dropoff_address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <input
                                type="date"
                                name="moving_date"
                                className="input full-width"
                                value={formData.moving_date}
                                onChange={handleChange}
                                required
                            />

                            <textarea
                                rows={4}
                                name="comments"
                                placeholder="Additional Comments"
                                className="textarea"
                                value={formData.comments}
                                onChange={handleChange}
                            />

                            <button type="submit" className="btn btn-red full-width">
                                SEND MESSAGE
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="services">
                <div className="container">
                    {locationData.content ? (
                        <div 
                            className="dynamic-content"
                            dangerouslySetInnerHTML={{ __html: locationData.content }}
                        />
                    ) : (
                        <div>
                            <h2>{locationData.main_heading}</h2>
                            <p>{locationData.description}</p>
                        </div>
                    )}
                </div>
            </section>

            <FAQ />
            <Footer />
        </div>
    );
};

export default MovingCompanyWebsite;