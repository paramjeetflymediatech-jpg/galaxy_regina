"use client";

import React, { useState } from "react";
import "./BestMovers.css";

const BestMovers = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logoIndex, setLogoIndex] = useState(0);

  // Gallery Images (ADD YOUR IMAGES HERE)
  const galleryImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    "https://images.unsplash.com/photo-1600585154207-5c3b0c7d8b45",
  ];

  // Trust Logos
  const trustLogos = [
    { name: "HomeStars", logo: "https://galaxymoversregina.ca/wp-content/uploads/2025/08/Facebook-Reviews-Logo.png" },
    { name: "BBB", logo: "https://galaxymoversregina.ca/wp-content/uploads/2025/08/HomeStars-Logo.jpg" },
    { name: "Trustpilot", logo: "https://galaxymoversregina.ca/wp-content/uploads/2025/08/bbb.png" },
    { name: "YellowPages", logo: "https://galaxymoversregina.ca/wp-content/uploads/2025/08/trustpilot-logo.png" },
    { name: "Google", logo: "https://galaxymoversregina.ca/wp-content/uploads/2025/08/google-regina.png" },
  ];

  // Gallery Controls
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Logo Controls
  const nextLogo = () => {
    setLogoIndex((prev) => (prev + 1) % trustLogos.length);
  };

  const prevLogo = () => {
    setLogoIndex((prev) => (prev - 1 + trustLogos.length) % trustLogos.length);
  };

  return (
    <>
      {/* TRUST LOGOS */}
      <section className="trust-logos-section">
        <div className="container">

          <div className="trust-logos-container">

            <button className="logo-nav-btn" onClick={prevLogo}>←</button>

            <div className="trust-logos-track">
              {trustLogos
                .slice(logoIndex, logoIndex + 4)
                .map((item, index) => (
                  <div key={index} className="trust-logo-item">
                    <img src={item.logo} alt={item.name} />
                  </div>
                ))}
            </div>

            <button className="logo-nav-btn" onClick={nextLogo}>→</button>

          </div>

        </div>
      </section>

      {/* GALLERY */}
      <section className="swiper-section">
        <div className="container">

          <h2 className="section-title">
            Moving Work Recently Completed​
          </h2>
          <h2 className= "section-title" style={{color:"red"}}>Trust Galaxy Movers Regina, Sk</h2>

          <div className="swiper-container">

            <img
              src={galleryImages[currentIndex]}
              alt="Gallery"
              className="swiper-image"
            />

            <button className="swiper-btn prev" onClick={prevSlide}>
              ←
            </button>

            <button className="swiper-btn next" onClick={nextSlide}>
              →
            </button>

          </div>

        </div>
      </section>
    </>
  );
};

export default BestMovers;