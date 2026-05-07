import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './jangchiDirectory.css';
import { fighterProfiles } from '../../data/fighters';

const categories = ['Barcha kategoriyalar', 'Boks', 'MMA', 'Kikboksing', 'Muay Tay'];

function JangchiDirectory() {
  const resultsRef = useRef(null);
  const selectRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barcha kategoriyalar');
  const [lookingFor, setLookingFor] = useState('jangchi');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const scrollToResults = () => {
    if (!resultsRef.current) {
      return;
    }

    const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  };

  const filteredProfiles = fighterProfiles.filter((profile) => {
    const matchesSearch =
      profile.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
      profile.role.toLowerCase().includes(searchValue.toLowerCase());
    const matchesLocation =
      profile.city.toLowerCase().includes(locationValue.toLowerCase()) ||
      profile.neighborhood.toLowerCase().includes(locationValue.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Barcha kategoriyalar' || profile.category === selectedCategory;
    const matchesType = profile.type === lookingFor;

    return matchesSearch && matchesLocation && matchesCategory && matchesType;
  });

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProfiles = filteredProfiles.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setIsDropdownOpen(false);
    window.requestAnimationFrame(scrollToResults);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, locationValue, selectedCategory, lookingFor]);

  useEffect(() => {
    if (!isDropdownOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  return (
    <section className="jangchi-directory">
      <div className="jangchi-directory__inner">
        <div className="jangchi-directory__toolbar">
          <div className="jangchi-directory__search-row">
            <label className="jangchi-directory__field">
              <span className="jangchi-directory__field-icon">Q</span>
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Jangchi yoki uslub qidiring"
              />
            </label>

            <label className="jangchi-directory__field">
              <span className="jangchi-directory__field-icon">P</span>
              <input
                type="text"
                value={locationValue}
                onChange={(event) => setLocationValue(event.target.value)}
                placeholder="Shahar yoki hudud"
              />
            </label>
          </div>

          <div className="jangchi-directory__filters">
            <button
              type="button"
              className={`jangchi-directory__switch ${lookingFor === 'jangchi' ? 'is-active' : ''}`}
              onClick={() => {
                setLookingFor((prev) => (prev === 'jangchi' ? 'murabbiy' : 'jangchi'));
                setCurrentPage(1);
              }}
            >
              <span className="jangchi-directory__switch-thumb" />
              <span>
                {lookingFor === 'jangchi'
                  ? 'Men jangchi izlayapman'
                  : 'Men murabbiy izlayapman'}
              </span>
            </button>

            <div
              ref={selectRef}
              className={`jangchi-directory__select ${isDropdownOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="jangchi-directory__select-trigger"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <span>Kategoriya</span>
                <span className="jangchi-directory__select-value">{selectedCategory}</span>
              </button>
              <div className="jangchi-directory__dropdown" role="listbox">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={`jangchi-directory__dropdown-item ${selectedCategory === category ? 'is-selected' : ''}`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="jangchi-directory__heading">
          <div>
            <h2>O'zingizga mos jangchini tanlang</h2>
            <p>{filteredProfiles.length} ta profil topildi</p>
          </div>
          <span className="jangchi-directory__meta">
            {lookingFor === 'jangchi' ? 'Jangchilar' : 'Murabbiylar'} ro'yxati
          </span>
        </div>

        <div className="jangchi-directory__grid" ref={resultsRef}>
          {currentProfiles.map((profile, index) => (
            <Link
              className="jangchi-card"
              to={`/jangchi/${profile.slug}`}
              key={profile.id}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="jangchi-card__image-wrap">
                <img src={profile.image} alt={profile.fullName} />
                <span className="jangchi-card__category">{profile.category}</span>
              </div>

              <div className="jangchi-card__body">
                <h3>{profile.fullName}</h3>
                <span className="jangchi-card__location">
                  {profile.city}, {profile.neighborhood}
                </span>
                <p>{profile.role}</p>

                <div className="jangchi-card__chips">
                  <span>{profile.price}</span>
                  <span>{profile.bonus}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {currentProfiles.length === 0 ? (
          <div className="jangchi-directory__empty">
            <h3>Natija topilmadi</h3>
            <p>Qidiruv yoki filterlarni o'zgartirib qayta urinib ko'ring.</p>
          </div>
        ) : null}

        <div className="jangchi-directory__footer">
          <p>Jami {filteredProfiles.length} ta natija ko'rsatilmoqda</p>
          <div className="jangchi-directory__pager">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Oldingi
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={currentPage === page ? 'is-current' : ''}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Keyingi
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JangchiDirectory;
