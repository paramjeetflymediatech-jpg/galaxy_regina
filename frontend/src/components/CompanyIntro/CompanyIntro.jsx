import React from 'react';
import './CompanyIntro.css';

const CompanyIntro = () => {
  return (
    <section className="company-intro">
      <div className="container">
        <div className="intro-grid">

          {/* Left Side - Image */}
          <div className="intro-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800" 
              alt="Galaxy Movers Regina Team"
              className="intro-image"
            />
          </div>

          {/* Right Side - Content */}
          <div className="intro-content">
            <h2 className="intro-title">
              Why Choose Galaxy Movers Regina?
            </h2>
            
            <p className="intro-text">
              Galaxy Movers Regina is one of the full service moving company in Regina having over a decade of experience under our belt. Besides this, we offer a number of customizable moving options when it comes to residential, business and long distance relocation. 
            </p>
            
            <p className="intro-text">
              In addition, we offer round the clock service to our customers to resolve any kind of problem that they might be facing. We truly stand out from the organizations in this location.
            </p>
            
            <p className="intro-text">
              We as movers in Regina offer our customers transparent pricing without any kind of hidden Fees while offering top notch services.
            </p>

            <button className="view-more-btn">
              VIEW MORE
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;