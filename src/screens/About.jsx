import React from 'react';
import '../css/About.css';
import CtaBanner from '../components/CtaBanner/CtaBanner';
import FAQ from '../components/FAQ/FAQ';

const About = ({ content }) => {
  const about = content?.about || {};

  // Hero fallback variables
  const heroTitle = about.heroTitle || 'About Galaxy Movers Regina';
  const heroSubtitle = about.heroSubtitle || 'Reliable Moving Company in Regina, SK';

  return (
    <>
      {/* 1. Hero Section */}
      <section className="about-hero">
        <div className="about-overlay">
          <div className="about-content">
            <h1>{heroTitle}</h1>
            <p className="hero-sub">{heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* 2. Introduction & Who We Are */}
      <section className="about-intro-section">
        <div className="container">
          <div className="about-intro-grid">
            <div className="intro-main-text">
              <h2 className="section-title-blue">Reliable Moving Company in Regina, SK</h2>
              <p>
                Galaxy Movers Regina is a trusted moving company in Regina, SK, providing professional local moving, long distance moving, residential moving, commercial moving, packing, furniture moving, and storage services. We are committed to making every move smooth, safe, affordable, and stress-free for families, homeowners, renters, students, and businesses across Regina and nearby areas.
              </p>
              <p>
                Moving is more than just transporting boxes from one place to another. It is about handling someone’s memories, belongings, furniture, business equipment, and personal items with care and respect. At Galaxy Movers Regina, we understand how important your move is, and that is why our team works with proper planning, safe handling, and a customer-first approach.
              </p>
              <p>
                Whether you are moving within Regina, relocating to another city, shifting your apartment, moving into a new home, or planning an office relocation, our experienced Regina movers are ready to help from start to finish.
              </p>
            </div>
            
            <div className="who-we-are-card">
              <h3 className="card-title-gold">Who We Are</h3>
              <p>
                Galaxy Movers Regina is built on trust, hard work, professionalism, and customer satisfaction. Our goal is to provide dependable moving services in Regina that customers can rely on with confidence. We believe every move should be organized, secure, and stress-free, no matter how big or small it is.
              </p>
              <p>
                Our moving team is trained to handle different types of relocations, including homes, apartments, offices, furniture, appliances, fragile items, and long distance moves. From careful packing to safe loading, smooth transportation, and proper unloading, we focus on every detail to protect your belongings throughout the complete moving process.
              </p>
              <p>
                As a local moving company in Regina, we understand the needs of the community. We know that customers want movers who are punctual, polite, careful, affordable, and professional. Galaxy Movers Regina works hard to deliver exactly that.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mv-card mission">
              <div className="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                Our mission is to become one of the most trusted movers in Regina by providing safe, affordable, and reliable moving services for every customer. We aim to reduce the stress of moving by offering complete moving solutions, including packing, loading, transportation, unloading, furniture moving, storage, residential relocation, and commercial moving.
              </p>
              <p>
                We believe that every customer deserves honest service, clear communication, careful handling, and a smooth moving experience. That is why Galaxy Movers Regina continues to focus on quality service, professional support, and customer satisfaction in every move we complete.
              </p>
            </div>

            <div className="mv-card vision">
              <div className="mv-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                Our vision is to make Galaxy Movers Regina a preferred name for moving services in Regina, SK. We want to be known as a moving company that customers can trust for local moving, long distance moving, office relocation, apartment moving, storage, and packing services.
              </p>
              <p>
                We aim to grow by providing dependable service, maintaining strong customer relationships, and making each move easier for the people and businesses of Regina. Our vision is simple: to make moving safer, smoother, and more comfortable for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What We Do */}
      <section className="what-we-do-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-title-blue">What We Do</h2>
            <p className="section-subtitle">
              Galaxy Movers Regina offers complete moving solutions for residential and commercial customers. Our services are designed to meet different moving needs, whether you are moving locally within Regina or planning a long distance relocation.
            </p>
          </div>

          <div className="about-services-grid">
            {[
              {
                icon: "📍",
                title: "Local Moving",
                desc: "We provide professional local moving services in Regina for homes, apartments, condos, offices, and small businesses. Our movers handle your belongings with care and help complete your move efficiently."
              },
              {
                icon: "🚚",
                title: "Long Distance Moving",
                desc: "Our long distance movers help customers relocate from Regina to other cities with proper planning, safe packing, careful loading, and reliable transportation."
              },
              {
                icon: "🏠",
                title: "Residential Moving",
                desc: "We help families, homeowners, renters, and students move safely from one home to another. From furniture to boxes, our team handles everything with care."
              },
              {
                icon: "🏢",
                title: "Commercial Moving",
                desc: "Our commercial moving services are ideal for offices, shops, clinics, and businesses. We focus on organized relocation to reduce downtime and business interruption."
              },
              {
                icon: "📦",
                title: "Packing Services",
                desc: "We provide packing support to protect fragile items, electronics, kitchenware, furniture, décor, and other belongings during moving and storage."
              },
              {
                icon: "🔒",
                title: "Storage Solutions",
                desc: "Galaxy Movers Regina also provides moving and storage support for customers who need temporary space during relocation, renovation, downsizing, or delayed possession."
              }
            ].map((srv, idx) => (
              <div key={idx} className="about-service-card">
                <div className="abs-icon">{srv.icon}</div>
                <h4>{srv.title}</h4>
                <p>{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trust & Approach */}
      <section className="trust-approach-section">
        <div className="container">
          <div className="trust-approach-grid">
            <div className="trust-column">
              <h2 className="section-title-blue">Why Customers Trust Galaxy Movers Regina</h2>
              <p>
                Customers choose Galaxy Movers Regina because we focus on safe moving, honest service, affordable pricing, and professional support. We know that moving can be stressful, so our team works hard to make the process easier for you.
              </p>
              <p>
                Our Regina movers are careful with your belongings, respectful of your property, and committed to completing your move on time. We use proper moving methods to reduce the risk of damage and keep your relocation organized from beginning to end.
              </p>
              <p>
                Whether you need house movers in Regina, apartment movers, office movers, furniture movers, long distance movers, or packing and storage services, Galaxy Movers Regina is ready to provide dependable support.
              </p>
            </div>

            <div className="approach-column">
              <div className="approach-card">
                <h3 className="card-title-gold">Our Moving Approach</h3>
                <p>
                  At Galaxy Movers Regina, we follow a simple and organized moving approach:
                </p>
                <ul className="approach-steps">
                  <li>
                    <span className="step-num">1</span>
                    <div>
                      <h5>Understand Needs</h5>
                      <p>We analyze your location, destination, moving date, property type, and item volume.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">2</span>
                    <div>
                      <h5>Organized Planning</h5>
                      <p>We plan every aspect of the transition according to your schedule and unique requirements.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">3</span>
                    <div>
                      <h5>Safe Execution</h5>
                      <p>On moving day, our team packs, wraps, loads, and transports everything with complete care.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Commitment & Confidence Callout */}
      <section className="about-commitment-section">
        <div className="container">
          <div className="commitment-banner">
            <div className="banner-content">
              <h3>Our Commitment</h3>
              <p>
                Galaxy Movers Regina is committed to providing high-quality moving services in Regina, SK. We believe in treating every customer with honesty, respect, and professionalism. Your belongings are important, and we handle them as if they were our own.
              </p>
              <p>
                Our commitment includes safe handling, timely service, clear communication, affordable moving solutions, and complete customer satisfaction. Whether your move is small or large, local or long distance, residential or commercial, we give every relocation the attention it deserves.
              </p>
              
              <div className="confidence-callout">
                <h4>Move With Confidence</h4>
                <p>
                  When you choose Galaxy Movers Regina, you choose a moving company in Regina that cares about your time, belongings, budget, and peace of mind. Our team is here to help you move with confidence, whether you are starting a new chapter in a new home, relocating your business, or moving to another city.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
      <FAQ />
    </>
  );
};

export default About;