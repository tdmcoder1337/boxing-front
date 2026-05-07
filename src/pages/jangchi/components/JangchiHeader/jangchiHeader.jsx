import React from 'react';
import './jangchiHeader.css';

function JangchiHeader() {
  return (
    <section className="jangchi-header">
      <div className="jangchi-header__inner">
        <span className="jangchi-header__eyebrow">Choose your fighter</span>
        <h1>Kuchli jangchilarni toping va o'zingizga mos profilni tezda saralang</h1>
        <p>
          Qidiruv, joylashuv va kategoriya bo'yicha saralab, sizga mos jangchini toping.
          Pastdagi barcha kartalar alohida array orqali boshqariladi, shuning uchun rasm,
          ism-familya, narx va boshqa matnlarni keyin bemalol o'zgartirasiz.
        </p>

        <div className="jangchi-header__stats">
          <div className="jangchi-header__stat">
            <strong>6 ta</strong>
            <span>Tanlangan profil</span>
          </div>
          <div className="jangchi-header__stat">
            <strong>3 xil</strong>
            <span>Kategoriya</span>
          </div>
          <div className="jangchi-header__stat">
            <strong>24/7</strong>
            <span>Tez bron qilish</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JangchiHeader;
