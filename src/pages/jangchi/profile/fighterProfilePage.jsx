import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar/navbar.jsx';
import Newsletter from '../../../components/Newsletter/newsletter.jsx';
import Footer from '../../../components/Footer/footer.jsx';
import { fighterProfiles } from '../data/fighters';
import './fighterProfilePage.css';

function FighterProfilePage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const fighter = fighterProfiles.find((item) => item.slug === slug) || fighterProfiles[0];

  return (
    <main className="fighter-profile-page">
      <Navbar />

      <section className="fighter-profile">
        <div className="fighter-profile__container">
          <button type="button" className="fighter-profile__back" onClick={() => navigate(-1)}>
            {'< '}Orqaga
          </button>

          <article className="fighter-profile__card">
            <div className="fighter-profile__hero">
              <img src={fighter.image} alt={fighter.fullName} />
              <div>
                <h1>{fighter.fullName}</h1>
                <p>
                  {fighter.category} • {fighter.city}, {fighter.neighborhood}
                </p>
                <span>{fighter.role}</span>
              </div>
            </div>

            <p className="fighter-profile__about">{fighter.about}</p>

            <div className="fighter-profile__chips">
              <span>{fighter.price}</span>
              <span>{fighter.duration}</span>
              <span>{fighter.format}</span>
            </div>

            <div className="fighter-profile__actions">
              <button type="button" onClick={() => navigate(`/jangchi/${fighter.slug}`)}>
                Jangchi detail
              </button>
              <button type="button" onClick={() => navigate(`/jangchi/${fighter.slug}/chat`)}>
                Chat
              </button>
            </div>
          </article>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}

export default FighterProfilePage;
