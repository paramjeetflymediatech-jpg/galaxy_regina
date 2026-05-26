"use client";

import React, { useState, useEffect } from 'react';
import './FAQ.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/faqs`);
        const json = await response.json();
        if (json.success) {
          setFaqs(json.faqs || []);
        }
      } catch (error) {
        console.error('Failed to load FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
 <>
    <section className="faq-section">
      
      <div className="container">
        <h2 className="faq-title">FREQUENTLY ASKED QUESTIONS</h2>

        <div className="faq-grid">
          {loading ? (
            <div className="faq-loading">Loading FAQs...</div>
          ) : faqs.length === 0 ? (
            <div className="faq-empty">No FAQs available at the moment.</div>
          ) : (
            faqs.map((faq, index) => (
              <div 
                key={faq.id || index} 
                className={`faq-item ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
     </>
    
  );
};

export default FAQ;