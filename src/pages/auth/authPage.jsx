import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/navbar.jsx';
import Footer from '../../components/Footer/footer.jsx';
import Newsletter from '../../components/Newsletter/newsletter.jsx';
import { useAuth } from '../../context/authContext.jsx';
import './authPage.css';

const initialRegisterForm = {
  name: '',
  username: '',
  email: '',
  password: ''
};

const initialLoginForm = {
  username: '',
  password: ''
};

function AuthPage() {
  const navigate = useNavigate();
  const { currentUser, isLoading, login, register } = useAuth();
  const [mode, setMode] = useState('register');
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && currentUser) {
      navigate('/profile', { replace: true });
    }
  }, [currentUser, isLoading, navigate]);

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };



  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setSuccessMessage('');
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (registerForm.password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register(registerForm);
      setSuccessMessage(response.message);
      setRegisterForm(initialRegisterForm);
      navigate('/profile');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await login(loginForm);
      setLoginForm(initialLoginForm);
      navigate('/profile');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <Navbar />

      <section className="auth-hero">
        <div className="auth-hero__backdrop" />
        <div className="auth-hero__inner">
          <div className="auth-hero__copy">
            <span className="auth-hero__eyebrow">Boxing ID</span>
            <h1>Kirish va profil boshqaruvi endi bir joyda</h1>
            <p>
              Ism, username, email va parol bilan ro&apos;yxatdan o&apos;ting. Agar avval ro&apos;yxatdan
              o&apos;tgan bo&apos;lsangiz, username va parol bilan bir necha soniyada tizimga kiring.
            </p>

            <div className="auth-hero__points">
              <div>
                <strong>Tez va sodda kirish</strong>
                <span>Username va parol bilan bir necha soniyada tizimga kirasiz.</span>
              </div>
              <div>
                <strong>Parol himoyasi</strong>
                <span>Parol kamida 6 ta belgidan iborat bo&apos;lishi majburiy.</span>
              </div>
              <div>
                <strong>Profilni yangilash</strong>
                <span>Rasm, bio va ismni keyin profil sahifasidan o&apos;zgartirasiz.</span>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-card__tabs">
              <button
                type="button"
                className={mode === 'register' ? 'is-active' : ''}
                onClick={() => switchMode('register')}
              >
                Ro&apos;yxatdan o&apos;tish
              </button>
              <button
                type="button"
                className={mode === 'login' ? 'is-active' : ''}
                onClick={() => switchMode('login')}
              >
                Kirish
              </button>
            </div>

            {mode === 'register' ? (
              <form className="auth-form" onSubmit={handleRegisterSubmit}>
                <h2>Yangi akkaunt ochish</h2>
                <label>
                  <span>Ism</span>
                  <input
                    name="name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    placeholder="Masalan, Muhammadsodiq"
                    required
                  />
                </label>
                <label>
                  <span>Foydalanuvchi nomi</span>
                  <input
                    name="username"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                    placeholder="username"
                    required
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    placeholder="email@gmail.com"
                    required
                  />
                </label>
                <label>
                  <span>Parol</span>
                  <input
                    type="password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    placeholder="Kamida 6 ta belgidan kam bo'lmasligi kerak"
                    minLength={6}
                    required
                  />
                </label>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Yuborilmoqda...' : "Ro'yxatdan o'tish"}
                </button>
              </form>
            ) : null}

            {mode === 'login' ? (
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <h2>Akkauntga kirish</h2>
                <label>
                  <span>Foydalanuvchi nomi</span>
                  <input
                    name="username"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                    placeholder="username"
                    required
                  />
                </label>
                <label>
                  <span>Parol</span>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder="Parolingiz"
                    required
                  />
                </label>

                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Tekshirilmoqda...' : 'Kirish'}
                </button>
              </form>
            ) : null}


            {error ? <p className="auth-card__message auth-card__message--error">{error}</p> : null}
            {successMessage ? (
              <p className="auth-card__message auth-card__message--success">{successMessage}</p>
            ) : null}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}

export default AuthPage;
