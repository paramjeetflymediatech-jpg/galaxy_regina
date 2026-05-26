
"use client";

import './Hero.css';
import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
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
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/api/quotes/submit',
        formData
      );

      alert('Quote Submitted Successfully');

      console.log(response.data);

      setFormData({
        full_name: '',
        email: '',
        mobile: '',
        move_type: '',
        pickup_address: '',
        dropoff_address: '',
        moving_date: '',
        comments: ''
      });

    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            WELCOME TO <span className="text-red">GALAXY MOVERS REGINA</span>
          </h1>
          <p className="hero-subtitle">
            LOCAL AND LONG-DISTANCE MOVING COMPANY IN REGINA
          </p>

          <div className="hero-buttons">
            <button className="btn btn-red">
              📞 GET QUOTE
            </button>
            <a href="tel:3064500708" className="btn btn-red">
              📱 (306) 450 0708
            </a>
          </div>
        </div>
      </section>

      {/* Form + Why Us Section */}
      <section className="quote-section">
        <div className="container">
          <div className="grid-two">

            {/* LEFT - FORM */}
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
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="input"
                    value={formData.email}
                    onChange={handleChange}
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
                  />
                  <select className="input"
                    name="move_type"
                    value={formData.move_type}
                    onChange={handleChange}>
                    <option>Select Move Type</option>
                    <option>1 Bedroom</option>
                    <option>2 Bedroom</option>
                    <option>3+ Bedroom</option>
                    <option>Office Move</option>
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
                  />
                  <input
                    type="text"
                    name="dropoff_address"
                    placeholder="Drop-off Address"
                    className="input"
                    value={formData.dropoff_address}
                    onChange={handleChange}
                  />
                </div>

                <input
                  type="date"
                  name="moving_date"
                  className="input full-width"
                  value={formData.moving_date}
                  onChange={handleChange}
                />

                <textarea
                  rows="5"
                  name="comments"
                  placeholder="Comments"
                  className="textarea"
                  value={formData.comments}
                  onChange={handleChange}
                ></textarea>

                <button type="submit" className="btn btn-red full-width">
                  SEND MESSAGE
                </button>
              </form>
            </div>

            {/* RIGHT - WHY MOVE WITH US */}
            <div className="card why-card">
              <h2 className="card-title">WHY MOVE WITH US?</h2>

              <div className="features-grid">
                {[
                  { icon: "🎧", title: "LOCAL MOVERS", desc: "Yeah, moving can be hard without the right help. But, we're here to help. We know the area and the community." },
                  { icon: "👔", title: "PROFESSIONAL", desc: "Our expert team delivers reliable service in every move. We guarantee premium care and quick responses." },
                  { icon: "📦", title: "GREAT PACKAGING", desc: "Packaging is more than just a box. Our team uses eco-friendly materials and premium packing methods." },
                  { icon: "⏰", title: "24/7 SUPPORT", desc: "No matter the time or day, our support team is available 24/7 to assist your moving needs." },
                ].map((item, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-icon">{item.icon}</div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Home;