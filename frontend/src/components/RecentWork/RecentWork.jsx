"use client";
import React, { useState, useEffect } from 'react';
import './RecentWork.css';

const RecentWork = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const works = [
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a26?w=800",
      title: "Full House Move - Regina",
    },
    {
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      title: "Mattress & Furniture Wrapping",
    },
    {
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      title: "Office Relocation",
    },
    {
      image: "https://images.unsplash.com/photo-1622290291469-4f5f8c2e1b3e?w=800",
      title: "Bedroom Setup Completed",
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % works.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + works.length) % works.length);
  };

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="recent-work">
      <div className="container">
        <h2 className="main-title">MOVING WORK RECENTLY COMPLETED</h2>
        <h3 className="sub-title">TRUST GALAXY MOVERS REGINA, SK</h3>

        <div className="slider-container">
          <button className="slider-btn prev" onClick={prevSlide}>←</button>

          <div className="slider-wrapper">
            <div 
              className="slider-track" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {works.map((work, index) => (
                <div key={index} className="slide">
                  <img src={work.image} alt={work.title} className="work-image" />
                  <div className="image-overlay">
                    <p className="work-title">{work.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="slider-btn next" onClick={nextSlide}>→</button>
        </div>

        {/* Dots */}
        <div className="slider-dots">
          {works.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentWork;