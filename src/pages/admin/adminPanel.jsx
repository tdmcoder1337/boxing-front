import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../../components/Navbar/navbar.jsx';
import Newsletter from '../../components/Newsletter/newsletter.jsx';
import Footer from '../../components/Footer/footer.jsx';
import { getChatThread, getChatThreads, postChatMessage } from '../../services/chatApi.js';
import './adminPanel.css';

const ADMIN_PATH = '/boxy-vault-portal-9247';
const ADMIN_LOGIN = 'boxyadmin';
const ADMIN_PASSWORD = 'BoxySecure9247';
const AUTH_KEY = 'boxy_admin_session';
const BOOKINGS_KEY = 'boxy_booking_queue';
const POLL_INTERVAL = 4000;

const formatTime = (value) =>
  new Date(value).toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit'
  });

const formatDate = (value) =>
  new Date(value).toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

function AdminPanel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('queue');
  const [chatThreads, setChatThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState('');
  const [activeThread, setActiveThread] = useState(null);
  const [chatError, setChatError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyAttachments, setReplyAttachments] = useState([]);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState('');
  const messagesContainerRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const audioRefs = useRef({});

  useEffect(() => {
    setIsAuthed(sessionStorage.getItem(AUTH_KEY) === 'ok');

    const savedBookings = localStorage.getItem(BOOKINGS_KEY);
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const stats = useMemo(() => {
    const pending = bookings.filter((item) => item.status === 'Kutilmoqda').length;
    const confirmed = bookings.filter((item) => item.status === 'Tasdiqlangan').length;
    const unreadChats = chatThreads.filter((thread) => thread.unreadForAdmin).length;
    return { total: bookings.length, pending, confirmed, unreadChats };
  }, [bookings, chatThreads]);

  useEffect(() => {
    if (!isAuthed) {
      return undefined;
    }

    let cancelled = false;

    const loadThreads = async () => {
      try {
        const response = await getChatThreads({ viewer: 'admin' });
        if (cancelled) {
          return;
        }

        setChatThreads(response.threads);

        if (!activeThreadId && response.threads.length) {
          setActiveThreadId(response.threads[0].id);
        }
      } catch (requestError) {
        if (!cancelled) {
          setChatError(requestError.message);
        }
      }
    };

    loadThreads();
    const intervalId = window.setInterval(loadThreads, POLL_INTERVAL);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeThreadId, isAuthed]);

  useEffect(() => {
    if (!isAuthed || !activeThreadId) {
      return undefined;
    }

    let cancelled = false;

    const loadThread = async () => {
      try {
        const response = await getChatThread(activeThreadId, { viewer: 'admin' });
        if (!cancelled) {
          setActiveThread(response.thread);
        }
      } catch (requestError) {
        if (!cancelled) {
          setChatError(requestError.message);
        }
      }
    };

    loadThread();
    const intervalId = window.setInterval(loadThread, POLL_INTERVAL);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeThreadId, isAuthed]);

  useEffect(() => {
    if (!activeThread?.messages?.length) {
      return;
    }

    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [activeThread]);

  useEffect(() => {
    setIsProfileExpanded(true);
    setPlayingAudioId('');
  }, [activeThreadId]);

  const saveBookings = (nextBookings) => {
    setBookings(nextBookings);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(nextBookings));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (username === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'ok');
      setIsAuthed(true);
      setError('');
      return;
    }

    setError('Login yoki parol noto`g`ri');
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthed(false);
    setUsername('');
    setPassword('');
    setActiveThreadId('');
    setActiveThread(null);
  };

  const handleStatusChange = (id, status) => {
    const nextBookings = bookings.map((item) => (item.id === id ? { ...item, status } : item));
    saveBookings(nextBookings);
  };

  const handleDelete = (id) => {
    const nextBookings = bookings.filter((item) => item.id !== id);
    saveBookings(nextBookings);
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Faylni o`qib bo`lmadi.'));
      reader.readAsDataURL(file);
    });

  const addReplyFiles = async (files) => {
    try {
      const mappedAttachments = await Promise.all(
        Array.from(files).map(async (file) => {
          const url = await fileToDataUrl(file);
          let type = 'image';

          if (file.type.startsWith('video/')) {
            type = 'video';
          } else if (file.type.startsWith('audio/')) {
            type = 'audio';
          }

          return {
            id: `${file.name}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            type,
            name: file.name,
            url
          };
        })
      );

      setReplyAttachments((prev) => [...prev, ...mappedAttachments]);
    } catch (requestError) {
      setChatError(requestError.message);
    }
  };

  const handleReplyFileChange = async (event) => {
    const { files } = event.target;

    if (files?.length) {
      await addReplyFiles(files);
    }

    event.target.value = '';
  };

  const toggleAudioPlayback = async (audioId) => {
    const selectedAudio = audioRefs.current[audioId];

    if (!selectedAudio) {
      return;
    }

    const isCurrentAudioPlaying = playingAudioId === audioId && !selectedAudio.paused;

    Object.entries(audioRefs.current).forEach(([key, audioElement]) => {
      if (audioElement && key !== audioId) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    });

    if (isCurrentAudioPlaying) {
      selectedAudio.pause();
      setPlayingAudioId('');
      return;
    }

    try {
      await selectedAudio.play();
      setPlayingAudioId(audioId);
    } catch (_error) {
      setChatError("Audio xabarni ijro qilib bo'lmadi.");
    }
  };

  const handleReplyKeyDown = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await handleSendReply();
    }
  };

  const handleSendReply = async () => {
    if (!activeThreadId || isSendingReply) {
      return;
    }

    const trimmedText = replyText.trim();

    if (!trimmedText && replyAttachments.length === 0) {
      return;
    }

    setIsSendingReply(true);
    setChatError('');

    try {
      const response = await postChatMessage(activeThreadId, {
        senderType: 'fighter',
        text: trimmedText,
        attachments: replyAttachments.map(({ type, name, url }) => ({ type, name, url }))
      });

      setActiveThread(response.thread);
      setReplyText('');
      setReplyAttachments([]);

      const threadsResponse = await getChatThreads({ viewer: 'admin' });
      setChatThreads(threadsResponse.threads);
    } catch (requestError) {
      setChatError(requestError.message);
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <main className="admin-page">
      <Navbar />

      <section className="admin-panel">
        <div className="admin-panel__inner">
          <div className="admin-panel__intro">
            <span className="admin-panel__eyebrow">Yashirin kirish</span>
            <h1>Boxy Admin Panel</h1>
            <p>
              Navbatlar va foydalanuvchilar jangchi bilan boshlagan chatlar shu yerda boshqariladi.
              Chatdan admin jangchi nomidan javob yozadi.
            </p>
            <code>{ADMIN_PATH}</code>
          </div>

          {!isAuthed ? (
            <form className="admin-login" onSubmit={handleLogin}>
              <h2>Login</h2>
              <label>
                <span>Login</span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Admin login"
                />
              </label>

              <label>
                <span>Parol</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Parol"
                />
              </label>

              {error ? <p className="admin-login__error">{error}</p> : null}

              <button type="submit">Kirish</button>
            </form>
          ) : (
            <div className="admin-dashboard">
              <div className="admin-dashboard__top">
                <div className="admin-stats">
                  <article>
                    <strong>{stats.total}</strong>
                    <span>Jami navbat</span>
                  </article>
                  <article>
                    <strong>{stats.pending}</strong>
                    <span>Kutilmoqda</span>
                  </article>
                  <article>
                    <strong>{stats.confirmed}</strong>
                    <span>Tasdiqlangan</span>
                  </article>
                  <article>
                    <strong>{stats.unreadChats}</strong>
                    <span>Yangi chat</span>
                  </article>
                </div>

                <button type="button" className="admin-dashboard__logout" onClick={handleLogout}>
                  Chiqish
                </button>
              </div>

              <div className="admin-dashboard__tabs">
                <button
                  type="button"
                  className={activeTab === 'queue' ? 'is-active' : ''}
                  onClick={() => setActiveTab('queue')}
                >
                  Navbatlar
                </button>
                <button
                  type="button"
                  className={activeTab === 'chat' ? 'is-active' : ''}
                  onClick={() => setActiveTab('chat')}
                >
                  Jangi chat
                </button>
              </div>

              {activeTab === 'queue' ? (
                <div className="admin-queue">
                  <div className="admin-queue__header">
                    <h2>Navbat ro`yxati</h2>
                    <p>Jangchi sahifasidan yuborilgan so`rovlar shu yerda chiqadi.</p>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="admin-queue__empty">
                      <h3>Hali navbat yo`q</h3>
                      <p>Foydalanuvchi sanani tanlab navbatga yozilganda bu yerda ko`rinadi.</p>
                    </div>
                  ) : (
                    <div className="admin-queue__list">
                      {bookings.map((booking) => (
                        <article className="admin-queue__card" key={booking.id}>
                          <div className="admin-queue__card-main">
                            <div>
                              <span className="admin-queue__label">Jangchi</span>
                              <strong>{booking.fighterName}</strong>
                            </div>
                            <div>
                              <span className="admin-queue__label">Sana</span>
                              <strong>{booking.date}</strong>
                            </div>
                            <div>
                              <span className="admin-queue__label">Vaqt</span>
                              <strong>{booking.time}</strong>
                            </div>
                            <div>
                              <span className="admin-queue__label">Holat</span>
                              <strong>{booking.status}</strong>
                            </div>
                          </div>

                          <div className="admin-queue__actions">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(booking.id, 'Tasdiqlangan')}
                            >
                              Tasdiqlash
                            </button>
                            <button
                              type="button"
                              className="is-secondary"
                              onClick={() => handleStatusChange(booking.id, 'Kutilmoqda')}
                            >
                              Kutishga qaytarish
                            </button>
                            <button
                              type="button"
                              className="is-danger"
                              onClick={() => handleDelete(booking.id)}
                            >
                              O`chirish
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="admin-chat">
                  <div className="admin-chat__sidebar">
                    <div className="admin-chat__sidebar-head">
                      <h2>Jangi chat</h2>
                      <p>Foydalanuvchilar yuborgan xabarlar shu yerga tushadi.</p>
                    </div>

                    <div className="admin-chat__conversation-list">
                      {chatThreads.length === 0 ? (
                        <div className="admin-chat__empty">
                          <h3>Hozircha chat yo`q</h3>
                          <p>Foydalanuvchi jangchi bilan suhbat boshlaganda shu yerda chiqadi.</p>
                        </div>
                      ) : (
                        chatThreads.map((thread) => (
                          <button
                            type="button"
                            key={thread.id}
                            className={`admin-chat__conversation ${
                              activeThreadId === thread.id ? 'is-active' : ''
                            }`}
                            onClick={() => setActiveThreadId(thread.id)}
                          >
                            <div className="admin-chat__conversation-avatar">
                              <img src={thread.fighterImage} alt={thread.fighterName} />
                              {thread.unreadForAdmin ? (
                                <span className="admin-chat__conversation-dot" />
                              ) : null}
                            </div>
                            <div className="admin-chat__conversation-copy">
                              <div className="admin-chat__conversation-top">
                                <strong>{thread.fighterName}</strong>
                                <span>{thread.lastMessageAt ? formatTime(thread.lastMessageAt) : ''}</span>
                              </div>
                              <small>{thread.userName}</small>
                              <p>{thread.lastMessageText || 'Yangi suhbat'}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="admin-chat__panel">
                    {activeThread ? (
                      <>
                        <div className="admin-chat__panel-head">
                          <button
                            type="button"
                            className="admin-chat__panel-profile"
                            onClick={() => setIsProfileExpanded((prev) => !prev)}
                          >
                            <img src={activeThread.userAvatar || activeThread.fighterImage} alt={activeThread.userName} />
                            <div>
                              <strong>{activeThread.userName}</strong>
                              <span>@{activeThread.userUsername || 'foydalanuvchi'}</span>
                            </div>
                          </button>
                          <div className="admin-chat__panel-meta">
                            <span>{activeThread.lastMessageAt ? formatDate(activeThread.lastMessageAt) : ''}</span>
                          </div>
                        </div>

                        {isProfileExpanded ? (
                          <div className="admin-chat__profile-panel">
                            <div className="admin-chat__profile-panel-main">
                              <img
                                src={activeThread.userAvatar || activeThread.fighterImage}
                                alt={activeThread.userName}
                              />
                              <div>
                                <h3>{activeThread.userName}</h3>
                                <span>@{activeThread.userUsername || 'foydalanuvchi'}</span>
                                <p>
                                  {activeThread.userBio ||
                                    "Bu foydalanuvchi hali bio qo'shmagan."}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className="admin-chat__messages" ref={messagesContainerRef}>
                          {activeThread.messages.map((message) => (
                            <article
                              key={message.id}
                              className={`admin-chat__bubble ${
                                message.senderType === 'fighter' ? 'is-fighter' : 'is-user'
                              }`}
                            >
                              {message.text ? <p>{message.text}</p> : null}

                              {message.attachments?.length ? (
                                <div className="admin-chat__attachments">
                                  {message.attachments.map((attachment) => (
                                    <div key={`${message.id}-${attachment.url}`} className="admin-chat__attachment">
                                      {attachment.type === 'image' ? (
                                        <img src={attachment.url} alt={attachment.name || 'Rasm'} />
                                      ) : null}
                                      {attachment.type === 'video' ? (
                                        <video controls src={attachment.url} />
                                      ) : null}
                                      {attachment.type === 'audio' ? (
                                        <div className="admin-chat__audio">
                                          <button
                                            type="button"
                                            className={`admin-chat__audio-play ${
                                              playingAudioId === `${message.id}-${attachment.url}` ? 'is-playing' : ''
                                            }`}
                                            onClick={() => toggleAudioPlayback(`${message.id}-${attachment.url}`)}
                                          >
                                            {playingAudioId === `${message.id}-${attachment.url}` ? '||' : '>'}
                                          </button>
                                          <div className="admin-chat__audio-copy">
                                            <strong>{attachment.name || 'Ovozli xabar'}</strong>
                                            <span>Play tugmasi bilan eshiting</span>
                                          </div>
                                          <audio
                                            ref={(node) => {
                                              if (node) {
                                                audioRefs.current[`${message.id}-${attachment.url}`] = node;
                                                node.onended = () => setPlayingAudioId('');
                                                node.onpause = () => {
                                                  if (node.currentTime > 0 && node.ended === false) {
                                                    setPlayingAudioId((current) =>
                                                      current === `${message.id}-${attachment.url}` ? '' : current
                                                    );
                                                  }
                                                };
                                              }
                                            }}
                                            src={attachment.url}
                                            preload="metadata"
                                          />
                                        </div>
                                      ) : null}
                                    </div>
                                  ))}
                                </div>
                              ) : null}

                              <div className="admin-chat__bubble-meta">
                                <span>{formatTime(message.createdAt)}</span>
                                {message.senderType === 'fighter' ? (
                                  <strong className={message.readByUser ? 'is-read' : ''}>
                                    {message.readByUser ? '✓✓' : '✓'}
                                  </strong>
                                ) : null}
                              </div>
                            </article>
                          ))}
                        </div>

                        <div className="admin-chat__composer">
                          {replyAttachments.length ? (
                            <div className="admin-chat__attachment-strip">
                              {replyAttachments.map((attachment) => (
                                <div key={attachment.id} className="admin-chat__attachment-chip">
                                  <span>{attachment.name}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setReplyAttachments((prev) =>
                                        prev.filter((item) => item.id !== attachment.id)
                                      )
                                    }
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          <textarea
                            value={replyText}
                            onChange={(event) => setReplyText(event.target.value)}
                            onKeyDown={handleReplyKeyDown}
                            placeholder="Jangchi nomidan javob yozing..."
                            rows={3}
                          />

                          <div className="admin-chat__composer-actions">
                            <div className="admin-chat__file-tools">
                              <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleReplyFileChange}
                              />
                              <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/*"
                                hidden
                                onChange={handleReplyFileChange}
                              />
                              <input
                                ref={audioInputRef}
                                type="file"
                                accept="audio/*"
                                hidden
                                onChange={handleReplyFileChange}
                              />

                              <button type="button" onClick={() => imageInputRef.current?.click()}>
                                Rasm
                              </button>
                              <button type="button" onClick={() => videoInputRef.current?.click()}>
                                Video
                              </button>
                              <button type="button" onClick={() => audioInputRef.current?.click()}>
                                Audio
                              </button>
                            </div>

                            <button type="button" className="admin-chat__send" onClick={handleSendReply}>
                              {isSendingReply ? 'Yuborilmoqda...' : 'Javob yuborish'}
                            </button>
                          </div>

                          {chatError ? <p className="admin-chat__error">{chatError}</p> : null}
                        </div>
                      </>
                    ) : (
                      <div className="admin-chat__empty admin-chat__empty--panel">
                        <h3>Chat tanlanmagan</h3>
                        <p>Chap tomondan suhbatni tanlang va fighter nomidan javob yozing.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}

export default AdminPanel;
