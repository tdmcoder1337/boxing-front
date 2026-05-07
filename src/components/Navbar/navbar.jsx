import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import logo from '../../assets/images/logo.png';
import login from '../../assets/icons/login.svg';
import { useAuth } from '../../context/authContext.jsx';

function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link className="navbar__brand" to="/">
          <img className="navbar__logo" src={logo} alt="Boks logosi" />
        </Link>

        <div className="navbar__links">
          <Link className="navbar__link" to="/">Bosh sahifa</Link>
          <Link className="navbar__link" to="/jangchi">Jangchini tanlang</Link>
          {currentUser ? (
            <>
              <Link className="navbar__profile" to="/profile">
                <span className="navbar__profile-avatar">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} />
                  ) : (
                    currentUser.name.slice(0, 1).toUpperCase()
                  )}
                </span>
                <span className="navbar__profile-copy">
                  <strong>{currentUser.name}</strong>
                  <small>@{currentUser.username}</small>
                </span>
              </Link>
              <button type="button" className="navbar__logout" onClick={logout}>
                Chiqish
              </button>
            </>
          ) : (
            <Link className="navbar__link navbar__login" to="/login">
              <span>Kirish</span>
              <span className="navbar__login-icon">
                <img src={login} alt="Kirish belgisi" />
              </span>
            </Link>
          )}
          <Link className="contact-btn" to="/contact">BOG'LANISH</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
