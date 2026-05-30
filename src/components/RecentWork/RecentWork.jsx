"use client";
import React, { useState, useEffect } from 'react';
import './RecentWork.css';

const RecentWork = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const works = [
    {
      image: "./services/house_mover.jpg",
      title: "Full House Move - Regina",
    },
    {
      image: "./services/condo.jpg",
      title: "Mattress & Furniture Wrapping",
    },
    {
      image: "./services/commercial_office_mover.jpg",
      title: "Office Relocation",
    },
    {
      image: "./services/heavy.jpg",
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
        <h2 className="main-title blue">MOVING WORK RECENTLY COMPLETED</h2>
        <h3 className="sub-title">TRUST GALAXY MOVERS REGINA, SK</h3>
        <p className="work-desc" style={{ textAlign: 'center', maxWidth: '800px', margin: '15px auto 30px', color: '#666', lineHeight: '1.6', fontSize: '1.1rem' }}>
          Galaxy Movers Regina has recently completed home moves, apartment relocations, office shifting, furniture moving, and long distance moving projects across Regina, SK. Our team continues to earn customer trust by delivering careful handling, reliable scheduling, professional support, and stress-free moving services for every relocation.
        </p>

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