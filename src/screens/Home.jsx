import React from 'react';

import HeroSection from '../components/HeroSection/HeroSection';
import Trusted from '../components/Trusted/Trusted';
import BestMovers from '../components/BestMovers/BestMovers';
import Services from '../components/Services/Services';
import WhyUs from '../components/WhyUs/WhyUs';
import CtaBanner from '../components/CtaBanner/CtaBanner';
import CompanyIntro from '../components/CompanyIntro/CompanyIntro';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import FAQ from '../components/FAQ/FAQ';
import Testimonials from '../components/Testimonials/Testimonials';
import RecentWork from '../components/RecentWork/RecentWork';


const Home = () => {
  return (
    <>
      <HeroSection />
      <Trusted />
      <BestMovers />
      <Services />
      <WhyUs />
      <CtaBanner />
      <CompanyIntro />
      <WhyChooseUs />
      <FAQ />
      <Testimonials />
      <RecentWork />
   
    </>
  );
};

export default Home;