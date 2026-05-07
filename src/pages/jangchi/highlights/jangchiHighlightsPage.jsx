import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar/navbar.jsx';
import Newsletter from '../../../components/Newsletter/newsletter.jsx';
import Footer from '../../../components/Footer/footer.jsx';
import { fighterProfiles } from '../data/fighters';
import './jangchiHighlightsPage.css';

function JangchiHighlightsPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const fighter = fighterProfiles.find((item) => item.slug === slug) || fighterProfiles[0];
  const highlights = fighter.highlights || [];

  return (
    <main className="jangchi-highlights-page">
      <Navbar />

      <div className="jangchi-highlights__breadcrumb">
        <div className="jangchi-highlights__container">
          <button
            type="button"
            onClick={() => navigate(`/jangchi/${fighter.slug}`)}
            className="jangchi-highlights__back"
          >
            {'< '}Orqaga
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => navigate(`/jangchi/${fighter.slug}`)}
            className="jangchi-highlights__crumb-link"
          >
            {fighter.fullName}
          </button>
          <span>/</span>
          <span className="jangchi-highlights__current">Mashxur janglari</span>
        </div>
      </div>

      <section className="jangchi-highlights__hero">
        <div className="jangchi-highlights__container">
          <p className="jangchi-highlights__eyebrow">Jangchi sahifasi</p>

          <div className="jangchi-highlights__hero-card">
            <div className="jangchi-highlights__hero-main">
              <div className="jangchi-highlights__avatar">
                <img src={fighter.image} alt={fighter.fullName} />
              </div>

              <div className="jangchi-highlights__hero-copy">
                <h1>Mashxur janglar</h1>
                <h2>{fighter.fullName}</h2>
                <p>{fighter.role}</p>

                <div className="jangchi-highlights__meta">
                  <span>{fighter.category}</span>
                  <span>{fighter.city}</span>
                  <span>{fighter.duration}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="jangchi-highlights__cta"
              onClick={() => navigate(`/jangchi/${fighter.slug}`)}
            >
              Band qilish
            </button>
          </div>

          <p className="jangchi-highlights__intro">
            Bu bo'limda {fighter.fullName}ning eng esda qolarli chiqishlari jamlandi. Har bir
            lavhada jangchining uslubi, tezligi va ringdagi qarorlari yaqqol ko'rinadi.
          </p>
        </div>
      </section>

      <section className="jangchi-highlights__content">
        <div className="jangchi-highlights__container">
          {highlights.length > 0 ? (
            <div className="jangchi-highlights__list">
              {highlights.map((highlight, index) => (
                <article key={highlight.id} className="jangchi-highlights__card">
                  <div className="jangchi-highlights__card-head">
                    <div>
                      <span className="jangchi-highlights__label">Lavha {index + 1}</span>
                      <h3>{highlight.title}</h3>
                    </div>

                    <span className="jangchi-highlights__tag">Tavsiya etiladi</span>
                  </div>

                  <p className="jangchi-highlights__description">
                    Ushbu jangda {fighter.fullName}ning {fighter.category.toLowerCase()} bo'yicha
                    texnikasi, qarshi hujumlari va tempni boshqarishi alohida ajralib turadi.
                  </p>

                  <div className="jangchi-highlights__media">
                    {highlight.video ? (
                      <video
                        controls
                        src={highlight.video}
                        poster={highlight.image}
                        className="jangchi-highlights__video"
                      />
                    ) : (
                      <img
                        src={highlight.image}
                        alt={highlight.title}
                        className="jangchi-highlights__image"
                      />
                    )}
                  </div>

                  <div className="jangchi-highlights__actions">
                    <span>Ko'rishga arziydigan lavha</span>
                    <button type="button" onClick={() => navigate(`/jangchi/${fighter.slug}/chat`)}>
                      Jangchi profiliga o'tish
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="jangchi-highlights__empty">
              <h3>Hozircha mashxur janglar qo'shilmagan</h3>
              <p>Tez orada bu sahifada yangi lavhalar paydo bo'ladi.</p>
            </div>
          )}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}

export default JangchiHighlightsPage;
