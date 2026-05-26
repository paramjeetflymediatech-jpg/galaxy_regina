import React from 'react';
import PageHero from '../PageHero/PageHero';
import './InsuranceClaims.css';

const InsuranceClaims = () => {
  return (
    <>
      <PageHero
        title="INSURANCE AND POLICY CLAIMS"
        bgImage="https://galaxymoversregina.ca/wp-content/uploads/2025/08/galaxy0regina.png"
      />

      <div className="insurance-content">
        <div className="content-wrapper">
          <h2 className="main-heading">
            Insurance And Policy Claims – Galaxy Movers Regina Ltd
          </h2>

          <p className="intro-text">
            Moving can indeed be quite hectic process and it is important that you take care of the items 
            that you are thinking to move. Also, it is important that insurance is taken which can safeguard 
            you in case any item gets damaged or lost.
          </p>

          <p className="intro-text">
            It is important you hire a good <span className="highlight">moving company</span> such as{' '}
            <span className="highlight">Galaxy Movers Regina Ltd</span>. We are highly experienced and we 
            would take care of all your items. But, in any kind of unfortunate event, accidents can take place. 
            The best part of our organization is that we are fully licensed and insured and thus we can truly 
            help you in case of any damage or item getting lost.
          </p>

          <h3 className="section-title">How to file a claim from Galaxy Movers Regina?</h3>
          
          <p className="intro-text">
            If you want to file a claim with Galaxy Movers Regina, then the process is quite easy and hassle free. 
            You just need to follow the steps that can be mentioned below:
          </p>

          <div className="steps-container">
            <div className="step">
              <h4>1. Complete Details Regarding the Damage</h4>
              <p>
                You need to inform us about the complete details of the items that are damaged or misplaced 
                during the time when the moving process took place. It is recommended that you do it at the 
                earliest such that we can start the process of inspection.
              </p>
            </div>

            <div className="step">
              <h4>2. Mention all the Important Information</h4>
              <p>
                All the important information regarding the damage should be given to us which includes 
                description about the damage, attached photos as well as supporting documents.
              </p>
            </div>

            <div className="step">
              <h4>3. Resolution & Review</h4>
              <p>
                After we receive all the details regarding the damage, then our specialized team would start 
                the claim process. Once that is processed, then we would replace the items or give you fair 
                compensation.
              </p>
            </div>
          </div>

          <p className="closing-text">
            It is advised that you take proper insurance as missing or damaged items can turn out to be very 
            costly. Further, let us know the items that needs proper care and we would get the job done for you.
          </p>

          {/* Buttons */}
          <div className="buttons-container">
            {/* <a
              href="https://wa.me/13064500708"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              💬 Chat on WhatsApp
            </a> */}

            <a href="#contact" className="contact-btn">
              → CONTACT US
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default InsuranceClaims;