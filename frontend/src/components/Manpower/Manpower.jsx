import React from 'react';
import PageHero from '../PageHero/PageHero';
import '../Manpower/Manpower.css';

const LicenseComponents = () => {
  return (
    <>
      <PageHero
        title="Manpower Only Moving Services in Regina"
        bgImage="https://galaxymoversregina.ca/wp-content/uploads/2025/07/1708059691_Home-shifting.jpg"
      />

      <div className="licensee-content">
        <div className="content-wrapper">

          <h2 className="section-title">
            Galaxy Movers Regina: Trusted Residential and Commercial Moving Services
          </h2>

          <p className="intro-text">
            Welcome to <span className="highlight">Galaxy Movers Regina</span>, 
            your premier local moving company serving Regina, Moose Jaw, 
            Moosomin, and surrounding areas. We specialize in stress-free 
            residential relocations and professional commercial moving services.
          </p>

          <p className="intro-text">
            Whether you are moving across town or relocating your business, 
            our expert movers ensure that your belongings are handled with 
            care and professionalism. From packing and loading to transportation 
            and unloading, we handle everything efficiently to give you a 
            smooth and hassle-free moving experience.
          </p>

          {/* Residential Moving */}
          <h2 className="section-title">
            Residential and House Movers in Moose Jaw
          </h2>

          <p className="intro-text">
            Looking for reliable house movers in Moose Jaw? Our experienced 
            team offers personalized packing, loading, transportation, and 
            unpacking services to ensure your belongings safely reach your 
            new location without damage.
          </p>

          <p className="intro-text">
            We understand how valuable your belongings are, which is why 
            we handle every item with extra care and attention. Our goal is 
            to provide efficient, safe, and stress-free residential moving 
            services for every customer.
          </p>

          {/* Commercial Moving */}
          <h2 className="section-title">
            Commercial Movers in Moose Jaw
          </h2>

          <p className="intro-text">
            Along with residential moving services, we also provide 
            professional commercial and office relocation services. 
            Our commercial movers in Moose Jaw help businesses relocate 
            smoothly while minimizing downtime and disruption.
          </p>

          <p className="intro-text">
            From office furniture and electronics to inventory and 
            important equipment, our professional team ensures safe 
            handling and secure transportation for every commercial move.
          </p>

          {/* Why Choose Us */}
          <h2 className="section-title">
            Why Choose Galaxy Movers Regina?
          </h2>

          <ul className="requirements-list">
            <li>Experienced residential and commercial movers in Moose Jaw</li>
            <li>Professional packing and secure transportation services</li>
            <li>Affordable and competitive moving prices</li>
            <li>Friendly and highly trained moving staff</li>
            <li>Reliable local and long-distance moving services</li>
            <li>Safe handling of furniture, appliances, and valuables</li>
          </ul>

          {/* Closing */}
          <div className="closing-text">
            <h2 className="section-title">
              Your Trusted Movers in Moose Jaw
            </h2>

            <p>
              Galaxy Movers Regina stands out as a trusted moving company 
              across Saskatchewan, delivering unmatched care, reliability, 
              and efficiency for every move.
            </p>

            <p>
              Whether you are moving your home, apartment, office, or business, 
              our professional movers in Moose Jaw ensure a stress-free 
              relocation experience from start to finish.
            </p>

            <p>
              Contact us today for a free moving quote and let our expert 
              movers handle your next move with care and professionalism.
            </p>

            <p>
              Email us at{' '}
              <a
                href="mailto:info@galaxymoversregina.ca"
                className="email-link"
              >
                info@galaxymoversregina.ca
              </a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default LicenseComponents;