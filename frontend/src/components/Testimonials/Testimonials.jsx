"use client";
import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Spiderweb Canada",
      time: "10 months ago",
      rating: 5,
      text: "They helped us move our 5 bedroom house from an acreage near Lumsden to Saskatoon move. Harry and his team were very professional, respectful and polite...",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Tijil Lall",
      time: "10 months ago",
      rating: 5,
      text: "Great service and timely. The team was very careful with our belongings and completed the move efficiently.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Jaspreet Kaur",
      time: "10 months ago",
      rating: 5,
      text: "I had a fantastic experience with Galaxy Movers Regina. They were able to accommodate me on short notice, which was a huge relief. The team was incredibly professional.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      name: "Rahul Sharma",
      time: "8 months ago",
      rating: 5,
      text: "Best movers in Regina! Very careful with my furniture and electronics. Highly recommended.",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="testimonials-title">
          PROFESSIONAL LOCAL MOVERS YOU CAN TRUST!
        </h2>

        <div className="testimonial-carousel">
          {/* Cards */}
          <div className="testimonial-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <img src={testimonial.avatar} alt={testimonial.name} className="avatar" />
                  <div>
                    <h4 className="name">{testimonial.name}</h4>
                    <p className="time">{testimonial.time}</p>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png" 
                       alt="Google" className="google-icon" />
                </div>

                <div className="stars">
                  {'★'.repeat(testimonial.rating)}
                </div>

                <p className="review-text">{testimonial.text}</p>

                <span className="read-more">Read more</span>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="nav-btn prev" onClick={prevSlide}>←</button>
          <button className="nav-btn next" onClick={nextSlide}>→</button>
        </div>

        {/* Dots */}
        <div className="dots">
          {testimonials.map((_, index) => (
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

export default Testimonials;