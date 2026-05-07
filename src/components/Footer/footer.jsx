import React from 'react';
import './footer.css';
import logo from '../../assets/images/logo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src={logo} alt="Boxy" />
          <p>
            Boxy platformasi orqali siz professional jangchilar va murabbiylar bilan bog'lanib,
            mashg'ulotlarni qulay tarzda bron qilishingiz mumkin.
          </p>
          <h4>Bizni kuzating</h4>
          <div className="footer__socials">
            <span>f</span>
            <span>yt</span>
            <span>x</span>
            <span>in</span>
            <span>ig</span>
          </div>
        </div>

        <div>
          <h4>Tezkor havolalar</h4>
          <ul>
            <li>Bosh sahifa</li>
            <li>Bog'lanish</li>
            <li>Jangchini tanlash</li>
            <li>Hozir bron qilish</li>
          </ul>
        </div>

        <div>
          <h4>Kategoriyalar +</h4>
          <ul className="footer__categories">
            <li>Boks</li>
            <li>Ji Jitsu</li>
            <li>Kikboksing</li>
            <li>Dzyudo</li>
            <li>Sambo</li>
            <li>Knuckle boxing</li>
            <li>Havaskor boks</li>
            <li>Catch wrestling</li>
            <li>Sarboji</li>
            <li>Wrestling</li>
          </ul>
        </div>

        <div className="footer__subscribe">
          <h4>Boxy yangiliklarini har doim birinchi bo'lib oling</h4>
          <p>Yangiliklar, tadbirlar va yangi murabbiylar haqida xabardor bo'lib boring.</p>
          <button type="button">Obuna bo'lish</button>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <span>© 2023 Barcha huquqlar himoyalangan</span>
          <span>Muhabbat bilan yaratildi</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
