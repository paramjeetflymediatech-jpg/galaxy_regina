import React from 'react';
import '../css/About.css';
import CtaBanner from '../components/CtaBanner/CtaBanner';
import FAQ from '../components/FAQ/FAQ';


const About = ({ content }) => {
  const about = content?.about || {};
  const heroTitle = about.heroTitle || 'About Galaxy Movers Regina';
  const heroSubtitle = about.heroSubtitle || 'Your Trusted Moving Partner Since 2012';
  const storyTitle = about.storyTitle || 'Our Story';
  const storyText = about.storyText || 'Galaxy Movers Regina was founded in 2012 with a simple mission — to provide stress-free, reliable, and professional moving services to the people of Regina and surrounding areas. What started as a small local moving company has now grown into one of the most trusted names in Saskatchewan for both local and long-distance moves.';
  const missionTitle = about.missionTitle || 'Our Mission';
  const missionText = about.missionText || 'To deliver exceptional moving experiences with honesty, care, and professionalism. We treat every customer\'s belongings as our own.';
  const whyTitle = about.whyTitle || 'Why Choose Us?';
  const whyPoints = [
    about.whyPoint1 || 'Over 12+ Years of Experience',
    about.whyPoint2 || 'Fully Licensed & Insured',
    about.whyPoint3 || 'Trained & Professional Movers',
  ];
  const imageUrl = about.imageUrl || 'https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize,to_auto,s_webp:avif/galaxymoversregina.ca/wp-content/uploads/2025/08/Images.webp';

  return (
    <>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-overlay">
          <div className="about-content">
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>{storyTitle}</h2>
              <p>{storyText}</p>

              <h2>{missionTitle}</h2>
              <p>{missionText}</p>

              <h2>{whyTitle}</h2>
              <ul className="about-list">
                {whyPoints.map((point, index) => (
                  <li key={index}>✅ {point}</li>
                ))}
              </ul>
            </div>

            <div className="about-image">
              <img src={imageUrl} alt="Galaxy Movers Team" />
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