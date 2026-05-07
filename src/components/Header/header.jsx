import React from 'react'
import './header.css'
import boxing from '../../assets/images/header-boxing.png';

function Header() {
  return (
    <header className='hero'>
      <div className="hero__inner">
        <div className="hero__left">
          <h1 className="hero__title">
            Jangchilarni qo'llab-quvvatlang va rivojlaning: <span>Boxy</span> orqali qulay bron qiling
          </h1>
          <p className='hero__text'>
            Boxy platformasiga xush kelibsiz. Bu yerda mahalliy professional jangchilar bilan
            individual darslar va seminarlarni oson bron qilasiz. Har bir bron sizning mahoratingizni
            oshiradi va shu bilan birga jangchilar hamda sevimli zallaringizni qo'llab-quvvatlaydi.
          </p>
          <div className="hero__actions">
            <button className="hero__btn" type="button">Jangchini bron qilish</button>
            <button className="hero__btn" type="button">Murabbiyni bron qilish</button>
          </div>
        </div>

        <div className="hero__visual">
          <img src={boxing} alt="Boks" />
        </div>
      </div>
    </header>
  )
}

export default Header
