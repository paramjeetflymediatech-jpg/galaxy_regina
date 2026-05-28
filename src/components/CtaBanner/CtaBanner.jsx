import React from 'react';
import './CtaBanner.css';

const CtaBanner = () => {
  return (
    <section className="cta-banner">
      <div className="cta-overlay">
        <div className="cta-content">
          <h2 className="cta-title">
            Book Professional Movers in Regina Today
          </h2>
          <p className="cta-subtitle" style={{ maxWidth: '800px', margin: '15px auto', fontSize: '1.1rem', lineHeight: '1.6', textTransform: 'none' }}>
            Ready to move? Galaxy Movers Regina is here to make your relocation simple, safe, and stress-free. Contact our experienced movers in Regina today for local moving, long distance moving, packing, storage, furniture moving, apartment moving, office relocation, and complete moving support across Regina, SK.
          </p>

          <button className="cta-button">
            → CLICK HERE TO GET A QUOTE
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;