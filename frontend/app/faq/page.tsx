import React from 'react'
import Navbar from '@/src/components/Navbar/Navbar';
import PageHero from '@/src/components/PageHero/PageHero';
import FAQ from '@/src/components/FAQ/FAQ';
import Footer from '@/src/components/Footer/Footer';

const FaqPage = () => {
  return (
    <div>
        <Navbar />
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