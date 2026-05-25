import React from 'react';
import '../css/HouseMovers.css';
import BestMovers from '../components/BestMovers/BestMovers';


const HouseMovers = () => {
  return (
    <>
      {/* Split Hero Banner */}
      <section className="split-hero">
        {/* Left Dark Side */}
        <div className="left-side">
          <div className="left-content">
            <h1>RELIABLE & PROFESSIONAL</h1>
            <h2>HOUSE MOVING SERVICES</h2>
            <p className="tagline">IN REGINA</p>
          </div>
        </div>

        {/* Right Blue Side + Quote Box */}
        <div className="right-side">
          <div className="quote-box">
            <h3>GET A FREE QUOTE</h3>
            
            <button className="quote-btn blue-btn">
              📞 CALL +1(306) 450 0708<br />
              <span>for FREE Quote Request</span>
            </button>

            <button className="quote-btn red-btn">
              BOOK ONLINE NOW<br />
              <span>or Request a Free Quote</span>
            </button>

            <div className="whatsapp">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
              WhatsApp
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="content-wrapper">
            <h2 className="main-heading">RELIABLE HOUSE MOVING SERVICES IN REGINA</h2>
            
            <p>
             Are you all set to move to your new house, but think that house moving is the most stressful job that you would ever have to do? Well, at Galaxy Movers, we have got you covered. If you are looking for the most trusted services in the Regina area, there is finally some good news! Whether you are moving just across the city or to a completely new zone, we are the only house movers you will ever need.</p>
            <p>
              Whether you are moving just across the city or to a completely new zone, we are the only house movers you will ever need.
            </p>

            <h2 className="section-title-para">PROFESSIONAL HOME SHIFTING SERVICES</h2>
            <p>If you think that moving a house is just about taking some boxes here and there, and any house movers near me can do that, then you are mistaken. From carefully packing each of the items to ensuring safe and secure transportation, each of it is our onus.

What more can you expect? Well, the Galaxy Movers Team will take care of the complete unpacking and dismantling of each item as well. As the best house moving service in Regina, we will help you with the easiest journey to your new address.</p>

            <h2 className="section-title-para">STRESS-FREE AND AFFORDABLE HOUSE SHIFTING SERVICES</h2>
            <p>It is our constant endeavour to make sure that you get a completely safe and hassle-free experience. But we also ensure that the services are priced to your pockets. For a quality service like ours, the cost is extremely affordable. Moreover, you can expect some discounts as well if you take up our package services. Sounds like the best deal, right?</p>

            <h2 className="section-title-para">TRUSTED AND RELIABLE HOUSE MOVING</h2>
            <p>To all of us, the belongings with which we build our house are like a comfort zone. Hence, correct packing and transportation remain a concern throughout the process. For any kind of house removals, Galaxy Movers Regina is your go-to choice. Contact us today, and we will make sure that you have an amazing experience. After all, building a home takes time and effort. We promise that you will get that from us.</p>

            <button className="contact-btn">→ CONTACT US</button>
          </div>
        </div>
      </div>
      <BestMovers/>
   
    </>
  );
};

export default HouseMovers;