import React from 'react';
import './whyBoxy.css';

const cards = [
  {
    icon: '1',
    title: 'Irodali jangchilar',
    text: "Tajribali mahalliy jangchilarni toping va ulardan saboq oling. Har bir bron ularning rivojiga to'g'ridan-to'g'ri yordam beradi."
  },
  {
    icon: '2',
    title: "Orzularni qo'llab-quvvatlash",
    text: "Bron qilingan har bir mashg'ulot jangchilarga barqaror daromad, zallarga esa barqarorlik olib keladi."
  },
  {
    icon: '3',
    title: 'Qulay jadval',
    text: "Individual dars, guruh mashg'uloti yoki seminar bo'lsin, Boxy orqali vaqtingizni tez va oson band qilasiz."
  },
  {
    icon: '4',
    title: "O'sishni kuzating",
    text: "Natijalaringizni kuzating, yangi marralarga erishing va mahalliy iqtidorlarni qo'llab-quvvatlang."
  },
  {
    icon: '5',
    title: 'Kuchli hamjamiyat',
    text: "Jangchilar, murabbiylar va sport ixlosmandlari bilan bog'lanib, bitta maqsad atrofida birlashgan hamjamiyatga qo'shiling."
  }
];

function WhyBoxy() {
  return (
    <section className="why-boxy" id="why-boxy">
      <div className="why-boxy__inner">
        <h2>Nega Boxy</h2>
        <p>
          Boxy sizga mashg'ulotlarni qulay bron qilish, professional murabbiy topish va natijani
          tezroq ko'rish imkonini beradi.
        </p>

        <div className="why-boxy__grid">
          {cards.map((card) => (
            <article className="why-boxy__card" key={card.title}>
              <div className="why-boxy__icon" aria-hidden="true">{card.icon}</div>
              <div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyBoxy;
