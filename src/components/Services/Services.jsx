"use client";   // ←←← Yeh line sabse top pe add kardo

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './Services.css';

const defaultServices = [
  {
    title: "HOUSE MOVERS",
    desc: "Galaxy movers offer reliable and easy house moving services customized to your needs.",
    image: "https://galaxymoversregina.ca/wp-content/uploads/2025/08/House-Movers.jpg",
    detail: 'Our house moving service includes packing, loading, transport, unloading and setup...',
    slug: 'house-movers'
  },
  {
    title: "CONDO & APARTMENT MOVERS",
    desc: "Specialized in narrow spaces, elevators & tight access. Safe and efficient condo moving.",
    image: "https://galaxymoversregina.ca/wp-content/uploads/2025/08/Condo-Apartment-Movers.jpg",
    slug: 'condo-apartment-movers'
  },
  {
    title: "COMMERCIAL & OFFICE MOVERS",
    desc: "Expert office relocation with minimal downtime.",
    image: "https://galaxymoversregina.ca/wp-content/uploads/2025/08/Commercial-Office-Movers.jpg",
    slug: 'commercial-office-movers'
  },
  {
    title: "LONG DISTANCE MOVERS",
    desc: "Safe and reliable long-distance moving across Canada.",
    image: "https://galaxymoversregina.ca/wp-content/uploads/2025/08/Long-Distance-Moving-Regina.jpg",
    slug: 'long-distance-movers'
  },
];

const Services = () => {
  const [servicesSection, setServicesSection] = useState({
    title: 'LOCAL AND LONG DISTANCE MOVING & STORAGE COMPANY',
    description: 'Since 2012, Galaxy Movers Regina earned customer’s trust and became the best moving and storage solutions company.',
    cards: defaultServices
  });

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  useEffect(() => {
    const loadServicesContent = async () => {
      try {
        const response = await fetch('/api/content/page/home');
        if (!response.ok) return;

        const json = await response.json();
        if (!json.success || !json.content?.services) return;

        const servicesData = json.content.services;
        const cards = servicesData.cards 
          ? JSON.parse(servicesData.cards) 
          : defaultServices;

        setServicesSection({
          title: servicesData.title || servicesSection.title,
          description: servicesData.description || servicesSection.description,
          cards: Array.isArray(cards) 
            ? cards.map((card) => ({
                ...card,
                slug: card.slug || slugify(card.title || `service-${Date.now()}`)
              }))
            : defaultServices
        });
      } catch (error) {
        console.error('Unable to load services content:', error);
      }
    };

    loadServicesContent();
  }, []);

  return (
    <>
      {/* Header Section */}
      <section className="services-hero">
        <div className="services-content">
          <h2 className="section-tag">SERVICES</h2>
          <h1 className="main-title">{servicesSection.title}</h1>
          <p className="description">{servicesSection.description}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            {servicesSection.cards.map((service, index) => (
              <div key={index} className="service-card">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="service-image" 
                />
                <div className="service-overlay">
                  <div className="service-info">
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-desc">{service.desc}</p>
                    <Link href={`/services/${service.slug}`}>
                      <button className="view-more-btn">VIEW MORE</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;