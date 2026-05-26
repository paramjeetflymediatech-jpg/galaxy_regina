import React from 'react';
import './Trusted.css';

const Trusted = () => {
  return (
    <>
      {/* Hero Section with Blue Background */}
      <section className="trusted-hero">
        <div className="trusted-overlay">
          <div className="trusted-content">
            <h1 className="trusted-title">
              Your 100% Trusted Moving Company in Regina
            </h1>
            <p className="trusted-subtitle">
              Reliable • Safe • Stress-Free
            </p>

            <div className="trusted-buttons">
              <button className="btn btn-primary">GET FREE QUOTE</button>
              <a href="tel:3064500708" className="btn btn-secondary">
                ☎️ (306) 450 0708
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges / Why Trust Us */}
      <section className="trust-section">
        <div className="container">
          <h2 className="section-title">Why Regina Trusts Galaxy Movers</h2>
          
          <div className="trust-grid">
            {[
              { number: "15+", label: "Years of Experience" },
              { number: "4.9+", label: "Reviews" },
              { number: "7,509+", label: "Moves Completed" },
              { number: "55+", label: "Experiences Staff" },
            ].map((item, index) => (
              <div key={index} className="trust-card">
                <h3 className="trust-number">{item.number}</h3>
                <p className="trust-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Trusted;