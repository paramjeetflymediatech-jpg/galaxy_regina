import React from 'react';
import './CtaBanner.css';

const CtaBanner = () => {
  return (
    <section className="cta-banner">
      <div className="cta-overlay">
        <div className="cta-content">
          <h2 className="cta-title">
            START YOUR REGINA MOVING JOURNEY WITH US TODAY
          </h2>
          <p className="cta-subtitle">
            BOOK YOUR NEXT MOVERS IN REGINA NOW WITH THE TRUSTED TEAM AT 
            <span className="highlight"> GALAXY MOVERS REGINA!</span>
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