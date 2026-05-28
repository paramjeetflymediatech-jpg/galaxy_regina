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
              Professional Moving Company in Regina, SK
            </h1>
            <p className="trusted-subtitle" style={{ maxWidth: '800px', margin: '20px auto 35px', textTransform: 'none', fontSize: '1.2rem', lineHeight: '1.6' }}>
              Galaxy Movers Regina provides dependable moving services for families, students, homeowners, renters, and businesses across Regina and nearby areas. As a trusted moving company in Regina, we focus on safe handling, timely service, affordable pricing, and a smooth relocation experience for every customer.
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
              { number: "1,000+", label: "Successful Moves Completed" },
              { number: "100%", label: "Customer-Focused Moving Service" },
              { number: "7 Days", label: "Flexible Moving Availability" },
              { number: "Local & Long Distance", label: "Moving Solutions Available" },
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