import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const steps = [
    {
      number: "1",
      title: "Professional Movers",
      desc: "Our professional movers in Regina are trained to handle homes, apartments, offices, furniture, fragile items, and long distance relocations with care. We work with proper planning, safe moving methods, and a customer-first approach to make your relocation smooth and secure."
    },
    {
      number: "2",
      title: "Honest Pricing",
      desc: "Galaxy Movers Regina believes in fair and transparent moving rates. We aim to provide affordable moving services in Regina without compromising quality. Our pricing approach helps customers plan their move confidently without worrying about unnecessary hidden charges or confusion."
    },
    {
      number: "3",
      title: "Complete Moving",
      desc: "From packing and loading to transportation, unloading, and storage, we offer complete moving solutions in Regina. Whether you need local movers, long distance movers, residential movers, or commercial movers, our team is ready to support your move from beginning to end."
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