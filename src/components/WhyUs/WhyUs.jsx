import React from 'react';
import './WhyUs.css';

const WhyUs = () => {
  const features = [
    {
      icon: "🛡️",
      title: "Careful Handling",
      desc: "Your belongings matter to us. Our movers use safe lifting, wrapping, packing, and loading methods to protect your items throughout the complete moving process."
    },
    {
      icon: "⏱️",
      title: "Timely Delivery",
      desc: "We value your schedule and work hard to complete every move on time. Our Regina movers focus on punctual pickup, transport, and delivery."
    },
    {
      icon: "📍",
      title: "Local Knowledge",
      desc: "As Regina movers, we understand local routes, neighborhoods, building access, and moving needs, helping us complete your move more smoothly and efficiently."
    },
    {
      icon: "💰",
      title: "Budget Friendly",
      desc: "Galaxy Movers Regina offers affordable moving services without compromising safety or quality, making professional moving support accessible for homes and businesses."
    },
    {
      icon: "📦",
      title: "Complete Support",
      desc: "From packing to moving and storage, we provide complete relocation support so you do not have to manage multiple moving service providers."
    },
    {
      icon: "🤝",
      title: "Trusted Service",
      desc: "Customers choose us for our honesty, professionalism, friendly approach, and commitment to making every move smooth, secure, and stress-free."
    }
  ];

  return (
    <section className="why-us-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Why Move With <span className="highlight">Galaxy Movers Regina?</span>
          </h2>
          <h3 className="section-subheading" style={{ fontSize: '24px', fontWeight: '800', color: '#0A1D8F', margin: '15px 0 20px' }}>
            Reliable Movers for Every Type of Move
          </h3>
          <p className="section-subtitle">
            Choosing Galaxy Movers Regina means choosing a dependable moving company in Regina that understands your relocation needs. Whether it is a local move, long distance move, office move, packing service, or storage requirement, we deliver professional support, careful handling, and a smooth moving experience.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="icon-wrapper">
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;