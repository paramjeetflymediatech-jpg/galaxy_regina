import React from 'react'
import PageHero from '../components/PageHero/PageHero'; 
import FAQ from '../components/FAQ/FAQ';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';

const FaqPage = () => {
  return (
    <div>
      <Navbar/>
       <PageHero
        title="FAQ'S"
        bgImage="https://galaxymoversregina.ca/wp-content/uploads/2025/07/1708059691_Home-shifting.jpg"
        />
      <FAQ/>
      <Footer/>
    </div>
  )
}

export default FaqPage