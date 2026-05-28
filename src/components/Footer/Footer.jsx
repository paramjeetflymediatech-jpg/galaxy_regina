import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Column 1 */}
        <div className="footer-column">
          <h3 className="footer-heading">Moving Services</h3>
          <p className="footer-text">
            Galaxy Movers Regina provides reliable local moving, long distance moving, packing, storage, residential moving, and commercial relocation services across Regina, SK, with professional care and trusted support.
          </p>
          
          {/* Font Awesome Social Icons */}
          <div className="social-icons">
            <a href="#" className="social-icon" target="_blank">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon" target="_blank">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon" target="_blank">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h3 className="footer-heading">Moving Services</h3>
          <ul className="service-list">
            <li>Long Distance Moving and Packing</li>
            <li>Interprovincial Moving</li>
            <li>Cross Country Moving</li>
            <li>Employee Relocation</li>
            <li>Installation And Removal Of Furniture</li>
            <li>School Moving And Public Areas Moving</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h3 className="footer-heading">Stay Connected</h3>
          
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <div>
                <p className="label">Phone Number</p>
                <p className="value">+1 (306) 450-0708</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <div>
                <p className="label">Email Us</p>
                <p className="value">galaxymoversregina@outlook.com</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <p className="label">Location</p>
                <p className="value">
                  2601 14 Ave unit 8, Regina, SK<br />
                  S4P 2V2
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2025 | BEST MOVERS IN REGINA | ALL RIGHTS RESERVED</p>
          <a href="https://wa.me/3064500708" target="_blank" className="whatsapp-btn">
            <i className="fab fa-whatsapp"></i> WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;