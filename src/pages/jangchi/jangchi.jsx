import React from 'react';
import './jangchi.css';
import JangchiHeader from './components/JangchiHeader/jangchiHeader.jsx';
import JangchiDirectory from './components/JangchiDirectory/jangchiDirectory.jsx';
import Navbar from '../../components/Navbar/navbar.jsx';
import Newsletter from '../../components/Newsletter/newsletter.jsx';
import Footer from '../../components/Footer/footer.jsx';
import { useNavigate } from 'react-router-dom';

function Jangchi() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  return (
    <main className="jangchi-page">
      <Navbar />
      <div className="jangchi-breadcrumb">
        <div className="jangchi-breadcrumb__inner">
          <button type="button" className="jangchi-breadcrumb__link" onClick={handleBack}>
            Bosh sahifa
          </button>
          <span>/</span>
          <span className="jangchi-breadcrumb__current">Jangchi</span>
        </div>
      </div>
      <JangchiHeader />
      <JangchiDirectory />
      <Newsletter />
      <Footer />
    </main>
  );
}

export default Jangchi;
