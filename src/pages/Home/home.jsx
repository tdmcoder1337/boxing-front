import React from 'react'
import "./home.css"
import Navbar from '../../components/Navbar/navbar.jsx';
import Header from '../../components/Header/header.jsx';
import WhyBoxy from '../../components/WhyBoxy/whyBoxy.jsx';
import FighterSection from '../../components/FighterSection/fighterSection.jsx';
import Newsletter from '../../components/Newsletter/newsletter.jsx';
import Footer from '../../components/Footer/footer.jsx';


function Home() {
  return (
    <main className="home-page">
      <Navbar />
      <Header />
      <WhyBoxy />
      <FighterSection title="Jangchini tanlang" ctaText="Ko'proq jangchilar" sectionId="fighters" />
      <Newsletter />
      <Footer />
    </main>
  )
}

export default Home
