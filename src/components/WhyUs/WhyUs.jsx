import React from 'react';
import './WhyUs.css';

const WhyUs = () => {
  const features = [
    {
      icon: "📋",
      title: "Transparent Fees",
      desc: "We believe in honesty. So, we provide the upfront clear quote to the customer before starting the work. Our transparent pricing schema ensures the fair charges without any additional amount."
    },
    {
      icon: "🔒",
      title: "Security",
      desc: "Moving can be tough but not with Galaxy Movers Regina. We are known for our safe transit. Your belongings are protected by our skilled team and modern vehicles."
    },
    {
      icon: "🕒",
      title: "24/7 Support",
      desc: "Our focus is on customer satisfaction. We offer 24/7 support to answer your queries or any urgencies. After-move support is also available."
    },
    {
      icon: "🏷️",
      title: "Price-Match Quotes",
      desc: "With our price-match policy, we offer the best rate. If you find a lower price, we will match it. No compromise with quality."
    },
    {
      icon: "👷‍♂️",
      title: "Moving Specialists",
      desc: "Galaxy Movers Regina assigns specialists who are thoroughly trained and verified. They handle every type of move with expertise."
    },
    {
      icon: "📍",
      title: "Moving Day Preparation",
      desc: "We offer packing, assembling, labelling, and loading. Step-by-step guidance and a unique checklist based on your needs."
    }
  ];

  return (
    <section className="why-us-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Why Move With <span className="highlight">Galaxy Movers Regina?</span>
          </h2>
          <p className="section-subtitle">
            Experience the difference with professional, reliable and customer-focused moving services.
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