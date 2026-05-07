import React from 'react';
import './newsletter.css';

function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter__inner">
        <h2>Eng so'nggi yangiliklar uchun obuna bo'ling</h2>
        <form className="newsletter__form">
          <input type="email" placeholder="Elektron pochtangizni kiriting" />
          <button type="submit">Obuna bo'lish</button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
