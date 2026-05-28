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
            <h3 className="intro-subtitle" style={{ fontSize: '1.4rem', color: '#ef4444', fontWeight: '700', marginBottom: '20px' }}>
              Your Trusted Moving Partner in Regina, SK
            </h3>
            
            <p className="intro-text">
              Galaxy Movers Regina is a professional moving company in Regina, SK, dedicated to making every relocation easier for homeowners, renters, families, students, and businesses. Moving can be stressful, but with the right team, it becomes simple, organized, and manageable. That is why our experienced movers focus on careful handling, clear communication, timely service, and customer satisfaction from the first call to the final delivery.
            </p>
            
            <p className="intro-text">
              We provide a complete range of moving services in Regina, including local moving, long distance moving, residential moving, commercial moving, packing services, furniture moving, apartment moving, office relocation, and storage solutions. Whether you are moving across the street, across Regina, or to another city, our team plans every step with attention to detail.
            </p>
            
            <p className="intro-text">
              As one of the trusted movers in Regina, Galaxy Movers Regina understands the importance of protecting your belongings. We handle furniture, appliances, boxes, fragile items, and office equipment with proper care. Our moving process is designed to save your time, reduce stress, and give you confidence throughout your relocation.
            </p>

            <p className="intro-text">
              When you choose Galaxy Movers Regina, you choose a reliable moving company that values honesty, professionalism, affordability, and safe moving service.
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