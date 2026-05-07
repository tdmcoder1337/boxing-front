import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './fighterSection.css';
import { fighterProfiles } from '../../pages/jangchi/data/fighters';

function FighterSection({ title, ctaText, sectionId }) {
  const [showMoreFighters, setShowMoreFighters] = useState(false);
  const cards = showMoreFighters ? fighterProfiles : fighterProfiles.slice(0, 3);

  return (
    <section className="fighters" id={sectionId}>
      <div className="fighters__inner">
        <h2>Jangchilar</h2>
        <p>
          Sizga mos murabbiy yoki jangchini tanlang, qulay vaqtni belgilang va mashg'ulotni tezda bron qiling.
        </p>

        <div className="fighters__cards">
          {cards.map((fighter) => (
            <Link
              className="fighter-card"
              to={`/jangchi/${fighter.slug}`}
              key={`${title}-${fighter.fullName}`}
            >
              <div className="fighter-card__image">
                <img src={fighter.image} alt={fighter.fullName} />
              </div>

              <h3>{fighter.fullName}</h3>
              <span className="fighter-card__city">{fighter.city}</span>
              <div className="fighter-card__meta">
                <p>{fighter.role}</p>
                <div className="fighter-card__chips">
                  <span>{fighter.price}</span>
                  <span>{fighter.bonus}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button
          className="fighters__cta"
          type="button"
          onClick={() => setShowMoreFighters((prev) => !prev)}
        >
          {showMoreFighters ? "Kamroq ko'rsatish" : "Ko'proq jangchilar"}
        </button>
      </div>
    </section>
  );
}

export default FighterSection;
