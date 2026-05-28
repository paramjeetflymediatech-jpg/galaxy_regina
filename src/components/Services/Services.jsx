"use client";   // ←←← Yeh line sabse top pe add kardo

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './Services.css';

const defaultServices = [
  {
    title: "Local Moving",
    desc: "Our local movers in Regina help you relocate homes, apartments, condos, and small offices safely within the city and nearby areas.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a26?w=800",
    slug: 'local-moving'
  },
  {
    title: "Long Distance Moving",
    desc: "We provide reliable long distance moving services from Regina to other cities with safe transport, careful planning, and timely delivery.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    slug: 'long-distance-moving'
  },
  {
    title: "Residential Moving",
    desc: "Move your home with confidence. We handle furniture, appliances, boxes, and personal items carefully for a stress-free residential relocation.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    slug: 'residential-moving'
  },
  {
    title: "Commercial Moving",
    desc: "Our commercial movers support office, shop, and business relocations with organized planning, safe equipment handling, and minimal business interruption.",
    image: "https://images.unsplash.com/photo-1622290291469-4f5f8c2e1b3e?w=800",
    slug: 'commercial-moving'
  },
  {
    title: "Packing Services",
    desc: "We offer professional packing services using proper materials to protect fragile items, furniture, electronics, kitchenware, and valuable belongings.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
    slug: 'packing-services'
  },
  {
    title: "Storage Solutions",
    desc: "Need extra space during your move? Our storage solutions help keep your items safe, organized, and accessible when required.",
    image: "https://images.unsplash.com/photo-1565538810844-1e1194826c94?w=800",
    slug: 'storage-solutions'
  },
];

const Services = () => {
  const [servicesSection, setServicesSection] = useState({
    title: 'LOCAL AND LONG DISTANCE MOVING & STORAGE COMPANY',
    description: 'Galaxy Movers Regina is a local and long distance moving and storage company serving Regina, SK, and surrounding communities. From packing and loading to transportation, unloading, and storage solutions, our professional movers help make your residential or commercial move simple, secure, and well-organized.',
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
    const loadDynamicServices = async () => {
      try {
        let pageTitle = servicesSection.title;
        let pageDesc = servicesSection.description;

        // 1. Fetch section text (title/description)
        try {
          const contentRes = await fetch('/api/content/page/home');
          if (contentRes.ok) {
            const contentJson = await contentRes.json();
            if (contentJson.success && contentJson.content?.services) {
              pageTitle = contentJson.content.services.title || pageTitle;
              pageDesc = contentJson.content.services.description || pageDesc;
            }
          }
        } catch (e) {
          console.error('Error fetching home page services metadata:', e);
        }

        // 2. Fetch dynamic active services from database
        let cards = defaultServices;
        try {
          const servicesRes = await fetch('/api/services');
          if (servicesRes.ok) {
            const servicesJson = await servicesRes.json();
            if (servicesJson.services && Array.isArray(servicesJson.services) && servicesJson.services.length > 0) {
              cards = servicesJson.services.slice(0, 6).map((srv) => ({
                title: srv.title,
                desc: srv.short_description || srv.description || '',
                image: srv.image_url
                  ? (srv.image_url.startsWith('http') ? srv.image_url : `/uploads/${srv.image_url}`)
                  : 'https://images.unsplash.com/photo-1600585154340-be6161a56a26?w=800',
                slug: srv.slug
              }));
            }
          }
        } catch (e) {
          console.error('Error fetching dynamic services:', e);
        }

        setServicesSection({
          title: pageTitle,
          description: pageDesc,
          cards: cards
        });
      } catch (error) {
        console.error('Error loading services data:', error);
      }
    };

    loadDynamicServices();
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