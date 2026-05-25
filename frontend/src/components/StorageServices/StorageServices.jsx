import React from 'react';
import PageHero from '../PageHero/PageHero';
import '../StorageServices/StorageServices.css';

const LicenseComponents = () => {
  return (
    <>
      <PageHero
        title="STORAGE SERVICES Regina"
        bgImage="https://galaxymoversregina.ca/wp-content/uploads/2025/08/galaxy0regina.png"
      />

      <div className="licensee-content">
        <div className="content-wrapper">
          <p className="intro-text">
            
            If you join <span className="highlight">Galaxy Movers Regina</span> as a licensee, 
            you would be having a great working atmosphere as well as competitive compensation. 
            Some of the key aspects that we look into our licensee are as follows:
          </p>

          <ul className="requirements-list">
            <li>Maintain an attitude that is positive</li>
            <li>Be flexible in terms of working hours</li>
            <li>Coordinate and work well alongside other team members</li>
            <li>Should have passion to learn new things</li>
            <li>Report any kind of deficiencies as well as do proper judgment</li>
            <li>Should be eligible to work in Canada and USA</li>
          </ul>

          <div className="closing-text">
            <p>
              Connect with us in building up a good community where everyone is enabled to thrive 
              while contributing towards their shared goals.
            </p>
            <p>
              Thus, we come up with inclusive and supportive community through which everyone can 
              be moved towards the path of the success.
            </p>
            <p>
              Lastly, it is recommended that you connect with us at{' '}
              <a href="mailto:info@galaxymoversregina.ca" className="email-link">
                info@galaxymoversregina.ca
              </a>{' '}
              if you are looking to become a licensee for our organization.
            </p>
          </div>

          {/* WhatsApp Button */}
          {/* <div className="whatsapp-container">
            <a
              href="https://wa.me/13064500708"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              💬 Chat on WhatsApp
            </a>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default LicenseComponents;