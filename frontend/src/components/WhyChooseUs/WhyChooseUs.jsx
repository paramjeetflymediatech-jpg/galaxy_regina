import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const steps = [
    {
      number: "1",
      title: "BOOK ONLINE",
      desc: "Your moving journey can get started with just a call. Fill an online form, which gives us an idea of your requirements so answer all the queries. Our team will inform all available service options, timing and prices that fit your needs. So, allow us to reduce your burden from the first step."
    },
    {
      number: "2",
      title: "CONFIRM BOOKING",
      desc: "Once you decide your moving options then confirm the booking as soon as possible. We will email you with the complete document including all moving details like date, time, and selected service. All preparations will be done in advance for smooth relocation."
    },
    {
      number: "3",
      title: "MEET THE MOVERS",
      desc: "Our skilled team is punctual. They arrive timely with the required tools and logistics on the decided date. After analyzing the complete plan, they will start execution. The team is capable of handling your stuff with top care and attention to transport everything safely."
    }
  ];

  return (
    <section className="why-choose-us">
      <div className="container">
        <h2 className="section-title-main">
  Why Choose Us!
</h2>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;