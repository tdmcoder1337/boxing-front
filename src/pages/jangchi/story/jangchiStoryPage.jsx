import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar/navbar.jsx';
import Newsletter from '../../../components/Newsletter/newsletter.jsx';
import Footer from '../../../components/Footer/footer.jsx';
import { fighterProfiles } from '../data/fighters';
import './jangchiStoryPage.css';

function JangchiStoryPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const fighter = fighterProfiles.find((item) => item.slug === slug) || fighterProfiles[0];

  const storyParagraphs = [
    `${fighter.fullName} ${fighter.city}dan chiqqan va ${fighter.category.toLowerCase()} yo'nalishida o'z uslubini shakllantirgan sportchi hisoblanadi. Uning yo'li oddiy mashg'ulotlardan boshlangan bo'lsa-da, bugun u intizom, bardoshlilik va to'g'ri yondashuv bilan ajralib turadi.`,
    `${fighter.about} Har bir mashg'ulot davomida u nafaqat texnika, balki ringdagi fikrlash, tez qaror qabul qilish va bosim ostida sovuqqon qolish kabi jihatlarga ham alohida e'tibor beradi.`,
    `Bugun ${fighter.fullName} o'z tajribasini boshqalar bilan bo'lishishni muhim deb biladi. ${fighter.city} va uning atrofidagi sport ixlosmandlari uchun u ilhom manbai bo'lib, kelajakda yanada ko'proq jangchi va yosh sportchilarga yo'l ko'rsatishni maqsad qilgan.`
  ];

  return (
    <main className="jangchi-story-page">
      <Navbar />

      <div className="jangchi-story__breadcrumb">
        <div className="jangchi-story__container">
          <button
            type="button"
            onClick={() => navigate(`/jangchi/${fighter.slug}`)}
            className="jangchi-story__back"
          >
            {'< '}Orqaga
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => navigate(`/jangchi/${fighter.slug}`)}
            className="jangchi-story__crumb-link"
          >
            {fighter.fullName}
          </button>
          <span>/</span>
          <span className="jangchi-story__current">Mening hikoyam</span>
        </div>
      </div>

      <section className="jangchi-story__hero">
        <div className="jangchi-story__container">
          <div className="jangchi-story__title-row">
            <button
              type="button"
              className="jangchi-story__title-back"
              onClick={() => navigate(`/jangchi/${fighter.slug}`)}
            >
              {'< '}
            </button>
            <h1>Mening hikoyam</h1>
          </div>

          <div className="jangchi-story__profile-card">
            <div className="jangchi-story__profile-main">
              <div className="jangchi-story__avatar">
                <img src={fighter.image} alt={fighter.fullName} />
              </div>

              <div className="jangchi-story__profile-copy">
                <div className="jangchi-story__name-row">
                  <h2>{fighter.fullName}</h2>
                  <span>{fighter.city}</span>
                </div>

                <div className="jangchi-story__meta">
                  <span>Soatlik narx: {fighter.price}</span>
                  <span>{fighter.bonus}</span>
                </div>

                <p>
                  {fighter.fullName}ning sportdagi yo'li, ichki motivatsiyasi va ring ortidagi
                  hayotiga oid qisqa hikoya shu sahifada jamlangan.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="jangchi-story__cta"
              onClick={() => navigate(`/jangchi/${fighter.slug}`)}
            >
              Band qilish
            </button>
          </div>
        </div>
      </section>

      <section className="jangchi-story__content">
        <div className="jangchi-story__container">
          <div className="jangchi-story__content-grid">
            <div className="jangchi-story__text">
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <aside className="jangchi-story__image-card">
              <img src={fighter.image} alt={`${fighter.fullName} hikoyasi`} />
              <div className="jangchi-story__image-overlay">
                <strong>{fighter.category}</strong>
                <span>{fighter.role}</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}

export default JangchiStoryPage;
