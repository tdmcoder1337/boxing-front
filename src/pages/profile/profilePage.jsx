import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/navbar.jsx';
import Footer from '../../components/Footer/footer.jsx';
import Newsletter from '../../components/Newsletter/newsletter.jsx';
import { useAuth } from '../../context/authContext.jsx';
import './profilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, isLoading, logout, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, isLoading, navigate]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!name.trim()) {
      setError('Ism bo`sh bo`lmasligi kerak.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await updateProfile({
        name,
        bio,
        avatar
      });
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <main className="profile-page">
        <Navbar />
        <section className="profile-shell">
          <div className="profile-shell__inner">
            <p className="profile-shell__loading">Profil yuklanmoqda...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <Navbar />

      <section className="profile-shell">
        <div className="profile-shell__inner">
          <div className="profile-summary">
            <div className="profile-summary__avatar">
              {avatar ? (
                <img src={avatar} alt={name} />
              ) : (
                <span>{name.slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <div className="profile-summary__copy">
              <span className="profile-summary__eyebrow">Sizning profilingiz</span>
              <h1>{name}</h1>
              <p>
                @{currentUser.username} • {currentUser.email}
              </p>
            </div>
            <button
              type="button"
              className="profile-summary__logout"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Chiqish
            </button>
          </div>

          <div className="profile-grid">
            <form className="profile-card" onSubmit={handleSubmit}>
              <div className="profile-card__header">
                <h2>Profilni tahrirlash</h2>
                <p>Ismni yangilang, bio yozing va rasm joylang.</p>
              </div>

              <label className="profile-card__upload">
                <span>Profil rasmi</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </label>

              <label>
                <span>Ism</span>
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>

              <label>
                <span>Bio</span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="O'zingiz haqingizda qisqacha yozing"
                  maxLength={280}
                />
              </label>

              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saqlanmoqda...' : 'O`zgarishlarni saqlash'}
              </button>

              {error ? <p className="profile-card__message profile-card__message--error">{error}</p> : null}
              {message ? (
                <p className="profile-card__message profile-card__message--success">{message}</p>
              ) : null}
            </form>

            <aside className="profile-side">
              <div className="profile-side__card">
                <h3>Akkaunt ma&apos;lumotlari</h3>
                <div>
                  <strong>Username</strong>
                  <span>@{currentUser.username}</span>
                </div>
                <div>
                  <strong>Email</strong>
                  <span>{currentUser.email}</span>
                </div>
              </div>

              <div className="profile-side__card">
                <h3>Profil ko&apos;rinishi</h3>
                <p>{bio || 'Hozircha bio qo`shilmagan. Bu yerga o`zingiz haqingizda qisqacha ma`lumot yozishingiz mumkin.'}</p>
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

export default ProfilePage;
