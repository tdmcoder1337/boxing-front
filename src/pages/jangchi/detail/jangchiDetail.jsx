import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar/navbar.jsx';
import Newsletter from '../../../components/Newsletter/newsletter.jsx';
import Footer from '../../../components/Footer/footer.jsx';
import { fighterProfiles } from '../data/fighters';
import { useAuth } from '../../../context/authContext.jsx';
import {
  createFighterComment,
  deleteFighterComment,
  getFighterComments,
  updateFighterComment
} from '../../../services/commentApi.js';
import './jangchiDetail.css';

const weekDays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
const COMMENTS_POLL_INTERVAL = 2000;

function JangchiDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fighter = fighterProfiles.find((item) => item.slug === slug) || fighterProfiles[0];
  const [selectedTime, setSelectedTime] = useState(fighter.availableTimes[0] || '');
  const today = useMemo(() => new Date(), []);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [bookingStatus, setBookingStatus] = useState('');
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isCommentLoading, setIsCommentLoading] = useState(true);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState('');
  const [editingContent, setEditingContent] = useState('');

  const availableDates = useMemo(() => {
    const baseDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    return Array.from({ length: 7 }, (_, index) => {
      const current = new Date(baseDate);
      current.setDate(baseDate.getDate() - 3 + index);
      return current;
    });
  }, [selectedDay, selectedMonth, selectedYear]);

  const currentVideo = fighter.video;
  const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
  const currentMonthLabel = selectedDate.toLocaleDateString('uz-UZ', {
    month: 'long',
    year: 'numeric'
  });
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const monthOptions = [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentyabr',
    'Oktyabr',
    'Noyabr',
    'Dekabr'
  ];
  const yearOptions = Array.from({ length: 11 }, (_, index) => today.getFullYear() - 2 + index);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/jangchi');
  };

  const handleScrollToCalendar = () => {
    const calendarElement = document.querySelector('.jangchi-detail__calendar');
    if (calendarElement) {
      calendarElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBooking = () => {
    if (!selectedTime) {
      setBookingStatus('error');
      setTimeout(() => setBookingStatus(''), 3000);
      return;
    }

    const bookingData = {
      id: Date.now(),
      fighterId: fighter.id,
      fighterName: fighter.fullName,
      fighterImage: fighter.image,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      duration: fighter.duration,
      price: fighter.price,
      format: fighter.format,
      location: `${fighter.city}, ${fighter.neighborhood}`,
      status: 'Kutilmoqda',
      bookedAt: new Date().toISOString()
    };

    const BOOKINGS_KEY = 'boxy_booking_queue';
    const existingBookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    existingBookings.push(bookingData);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(existingBookings));

    setBookingStatus('success');
    setTimeout(() => setBookingStatus(''), 3000);
  };

  useEffect(() => {
    const maxDay = new Date(selectedYear, selectedMonth, 0).getDate();
    if (selectedDay > maxDay) {
      setSelectedDay(maxDay);
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  useEffect(() => {
    let cancelled = false;
    let intervalId;

    const loadComments = async ({ silent = false } = {}) => {
      if (!silent) {
        setIsCommentLoading(true);
      }
      try {
        const response = await getFighterComments(fighter.slug);
        if (!cancelled) {
          setComments(response.comments || []);
          setCommentError('');
        }
      } catch (requestError) {
        if (!cancelled) {
          setCommentError(requestError.message);
        }
      } finally {
        if (!cancelled && !silent) {
          setIsCommentLoading(false);
        }
      }
    };

    loadComments();
    intervalId = window.setInterval(() => {
      loadComments({ silent: true });
    }, COMMENTS_POLL_INTERVAL);

    return () => {
      cancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [fighter.slug]);

  const formatCommentDate = (value) =>
    new Date(value).toLocaleString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

  const handleCreateComment = async (event) => {
    event.preventDefault();
    setCommentError('');

    if (!currentUser) {
      setCommentError("Kommentariya yozish uchun ro'yxatdan o'ting.");
      return;
    }

    if (!commentText.trim()) {
      setCommentError('Kommentariya bo`sh bo`lmasligi kerak.');
      return;
    }

    setIsCommentSubmitting(true);

    try {
      const response = await createFighterComment(fighter.slug, {
        userId: currentUser.id,
        content: commentText
      });
      setComments((prev) => [response.comment, ...prev]);
      setCommentText('');
    } catch (requestError) {
      setCommentError(requestError.message);
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingContent.trim()) {
      setCommentError('Kommentariya matni bo`sh bo`lmasligi kerak.');
      return;
    }

    try {
      const response = await updateFighterComment(fighter.slug, commentId, {
        userId: currentUser.id,
        content: editingContent
      });
      setComments((prev) => prev.map((item) => (item.id === commentId ? response.comment : item)));
      setEditingCommentId('');
      setEditingContent('');
      setCommentError('');
    } catch (requestError) {
      setCommentError(requestError.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteFighterComment(fighter.slug, commentId, { userId: currentUser.id });
      setComments((prev) => prev.filter((item) => item.id !== commentId));
    } catch (requestError) {
      setCommentError(requestError.message);
    }
  };

  const renderDateDropdown = (label, value, options, onSelect, getOptionLabel = (option) => option) => (
    <div className="jangchi-detail__date-dropdown">
      <span>{label}</span>
      <button type="button" className="jangchi-detail__date-trigger">
        {getOptionLabel(value)}
      </button>
      <div className="jangchi-detail__date-menu">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={value === option ? 'is-active' : ''}
            onClick={() => onSelect(option)}
          >
            {getOptionLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <main className="jangchi-detail-page">
      <Navbar />

      <div className="jangchi-detail__breadcrumb">
        <div className="jangchi-detail__container">
          <button type="button" onClick={handleBack} className="jangchi-detail__crumb-link">
            Bosh sahifa
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => navigate('/jangchi')}
            className="jangchi-detail__crumb-link"
          >
            Jangchilar
          </button>
          <span>/</span>
          <span className="jangchi-detail__crumb-current">{fighter.fullName}</span>
        </div>
      </div>

      <section className="jangchi-detail">
        <div className="jangchi-detail__container">
          <h1>{fighter.fullName}</h1>

          <div className="jangchi-detail__video">
            <div className="jangchi-detail__video-screen">
              {currentVideo ? (
                <video
                  controls
                  src={currentVideo}
                  poster={fighter.image}
                  className="jangchi-detail__video-player"
                />
              ) : (
                <>
                  <img src={fighter.image} alt={fighter.fullName} />
                  <div className="jangchi-detail__video-overlay" />
                  <div className="jangchi-detail__video-placeholder">
                    <strong>Videoni tomosha qilishingiz mumkin</strong>
                  </div>
                </>
              )}
            </div>

            <div className="jangchi-detail__player">
              <div className="jangchi-detail__player-actions">
                <span>{currentVideo ? 'Video mavjud' : 'Demo preview'}</span>
              </div>
              <div className="jangchi-detail__progress">
                <span />
              </div>
            </div>
          </div>

          <div className="jangchi-detail__profile">
            <div className="jangchi-detail__profile-main">
              <div className="jangchi-detail__avatar">
                <button type="button" onClick={() => navigate(`/jangchi/${fighter.slug}/profile`)}>
                  <img src={fighter.image} alt={fighter.fullName} />
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="jangchi-detail__profile-link"
                  onClick={() => navigate(`/jangchi/${fighter.slug}/profile`)}
                >
                  {fighter.fullName}
                </button>
                <p>
                  {fighter.city}, {fighter.neighborhood}
                </p>
                <div className="jangchi-detail__chips">
                  <span>{fighter.price}</span>
                  <span>{fighter.bonus}</span>
                </div>
              </div>
            </div>

            <button type="button" className="jangchi-detail__book" onClick={handleScrollToCalendar}>
              Band qilish
            </button>
            <button
              type="button"
              className="jangchi-detail__book"
              onClick={() => navigate(`/jangchi/${fighter.slug}/chat`)}
            >
              Chat ochish
            </button>

            {bookingStatus === 'success' && (
              <div className="jangchi-detail__booking-success">
                Navbatga muvaffaqiyatli yozildingiz. Admin panelda ko'rish mumkin.
              </div>
            )}

            {bookingStatus === 'error' && (
              <div className="jangchi-detail__booking-error">Iltimos, vaqtni tanlang.</div>
            )}
          </div>

          <p className="jangchi-detail__about">{fighter.about}</p>

          <div className="jangchi-detail__media-grid">
            <article className="jangchi-detail__media-card">
              <img src={fighter.image} alt={`${fighter.fullName} highlights`} />
              <button
                type="button"
                onClick={() => navigate(`/jangchi/${fighter.slug}/mashxur-janglari`)}
              >
                Mashxur janglari
              </button>
            </article>
            <article className="jangchi-detail__media-card">
              <img src={fighter.image} alt={`${fighter.fullName} hikoya`} />
              <button
                type="button"
                onClick={() => navigate(`/jangchi/${fighter.slug}/mening-hikoyam`)}
              >
                Mening hikoyam
              </button>
            </article>
          </div>

          <section className="jangchi-detail__schedule">
            <h3>Jadval</h3>
            <div className="jangchi-detail__schedule-grid">
              <div className="jangchi-detail__schedule-info">
                <div className="jangchi-detail__coach">
                  <div className="jangchi-detail__coach-avatar">
                    <img src={fighter.image} alt={fighter.fullName} />
                  </div>
                  <div>
                    <strong>{fighter.fullName}</strong>
                    <span>{fighter.duration}</span>
                  </div>
                </div>

                <ul>
                  <li>Davomiyligi: {fighter.duration}</li>
                  <li>Format: {fighter.format}</li>
                  <li>Hudud: {fighter.city}</li>
                  <li>Vaqt zonasi: {fighter.timezone}</li>
                </ul>
              </div>

              <div className="jangchi-detail__calendar">
                <div className="jangchi-detail__calendar-head">
                  <strong>{currentMonthLabel}</strong>
                  <div className="jangchi-detail__date-controls">
                    {renderDateDropdown(
                      'Kun',
                      selectedDay,
                      Array.from({ length: daysInMonth }, (_, index) => index + 1),
                      setSelectedDay
                    )}

                    {renderDateDropdown(
                      'Oy',
                      selectedMonth,
                      monthOptions.map((_, index) => index + 1),
                      setSelectedMonth,
                      (option) => monthOptions[option - 1]
                    )}

                    {renderDateDropdown('Yil', selectedYear, yearOptions, setSelectedYear)}
                  </div>
                </div>

                <div className="jangchi-detail__calendar-days">
                  {weekDays.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="jangchi-detail__calendar-dates">
                  {availableDates.map((date) => (
                    <button
                      type="button"
                      key={date.toISOString()}
                      className={
                        date.getDate() === selectedDay &&
                        date.getMonth() + 1 === selectedMonth &&
                        date.getFullYear() === selectedYear
                          ? 'is-active'
                          : ''
                      }
                      onClick={() => {
                        setSelectedDay(date.getDate());
                        setSelectedMonth(date.getMonth() + 1);
                        setSelectedYear(date.getFullYear());
                      }}
                    >
                      {date.getDate()}
                    </button>
                  ))}
                </div>

                <div className="jangchi-detail__time-slots">
                  <div className="jangchi-detail__time-buttons">
                    {fighter.availableTimes.map((time) => (
                      <button
                        type="button"
                        key={time}
                        className={selectedTime === time ? 'is-active' : ''}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="jangchi-detail__book" onClick={handleBooking}>
                    Band qilish
                  </button>
                </div>

                <p className="jangchi-detail__selected-time">
                  Tanlangan vaqt:{' '}
                  {selectedDate.toLocaleDateString('uz-UZ', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}{' '}
                  {selectedTime}
                </p>

                {bookingStatus === 'success' && (
                  <div className="jangchi-detail__booking-success">
                    Navbatga muvaffaqiyatli yozildingiz. Admin panelda ko'rish mumkin.
                  </div>
                )}

                {bookingStatus === 'error' && (
                  <div className="jangchi-detail__booking-error">Iltimos, vaqtni tanlang.</div>
                )}
              </div>
            </div>
          </section>

          <section className="jangchi-detail__comments">
            <h3>Kommentariyalar</h3>

            {!currentUser ? (
              <p className="jangchi-detail__comments-auth">
                Kommentariya yozish uchun avval ro&apos;yxatdan o&apos;ting yoki kirish qiling.
              </p>
            ) : (
              <form className="jangchi-detail__comment-form" onSubmit={handleCreateComment}>
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Fikringizni yozing..."
                  maxLength={500}
                />
                <button type="submit" className="jangchi-detail__book" disabled={isCommentSubmitting}>
                  {isCommentSubmitting ? 'Yuborilmoqda...' : 'Kommentariya yozish'}
                </button>
              </form>
            )}

            {commentError ? <p className="jangchi-detail__booking-error">{commentError}</p> : null}

            <div className="jangchi-detail__comment-list">
              {isCommentLoading ? <p>Komentlar yuklanmoqda...</p> : null}

              {!isCommentLoading && comments.length === 0 ? (
                <p>Hozircha kommentariya yo&apos;q.</p>
              ) : null}

              {comments.map((comment) => {
                const isOwner = currentUser?.id === comment.userId;

                return (
                  <article className="jangchi-detail__comment-item" key={comment.id}>
                    <div className="jangchi-detail__comment-head">
                      <strong>{comment.userName}</strong>
                      <span>@{comment.username}</span>
                      <small>{formatCommentDate(comment.updatedAt || comment.createdAt)}</small>
                    </div>

                    {editingCommentId === comment.id ? (
                      <div className="jangchi-detail__comment-edit">
                        <textarea
                          value={editingContent}
                          onChange={(event) => setEditingContent(event.target.value)}
                          maxLength={500}
                        />
                        <div>
                          <button type="button" onClick={() => handleUpdateComment(comment.id)}>
                            Saqlash
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCommentId('');
                              setEditingContent('');
                            }}
                          >
                            Bekor qilish
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>{comment.content}</p>
                    )}

                    {isOwner && editingCommentId !== comment.id ? (
                      <div className="jangchi-detail__comment-actions">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditingContent(comment.content);
                          }}
                        >
                          Tahrirlash
                        </button>
                        <button type="button" onClick={() => handleDeleteComment(comment.id)}>
                          O&apos;chirish
                        </button>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}

export default JangchiDetail;
