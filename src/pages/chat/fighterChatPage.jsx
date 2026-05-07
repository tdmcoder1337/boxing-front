import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/navbar.jsx';
import Newsletter from '../../components/Newsletter/newsletter.jsx';
import Footer from '../../components/Footer/footer.jsx';
import { useAuth } from '../../context/authContext.jsx';
import { getChatThread, postChatMessage, startChatThread } from '../../services/chatApi.js';
import { fighterProfiles } from '../jangchi/data/fighters';
import './fighterChatPage.css';

const POLL_INTERVAL = 4000;

const formatTime = (value) =>
  new Date(value).toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit'
  });

const getStatusMark = (message) => {
  if (message.senderType !== 'user') {
    return '';
  }

  return message.readByFighter ? '✓✓' : '✓';
};

function FighterChatPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { currentUser, isLoading } = useAuth();
  const fighter = useMemo(
    () => fighterProfiles.find((item) => item.slug === slug) || fighterProfiles[0],
    [slug]
  );
  const [thread, setThread] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState('');
  const messagesContainerRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRefs = useRef({});

  const fighterProfile = useMemo(
    () => ({
      name: fighter.fullName,
      username: `@${fighter.slug.replace(/-/g, '_')}`,
      bio: fighter.about,
      image: fighter.image
    }),
    [fighter]
  );

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, isLoading, navigate]);

  useEffect(() => {
    if (!thread?.messages?.length) {
      return;
    }

    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [thread]);

  useEffect(() => {
    if (isLoading || !currentUser) {
      return undefined;
    }

    let intervalId;
    let cancelled = false;

    const bootstrap = async () => {
      try {
        setIsBootstrapping(true);
        const response = await startChatThread({
          userId: currentUser.id,
          fighterId: fighter.id,
          fighterSlug: fighter.slug,
          fighterName: fighter.fullName,
          fighterImage: fighter.image
        });

        if (cancelled) {
          return;
        }

        setThread(response.thread);
        intervalId = window.setInterval(async () => {
          try {
            const latest = await getChatThread(response.thread.id, {
              viewer: 'user',
              userId: currentUser.id
            });
            if (!cancelled) {
              setThread(latest.thread);
            }
          } catch (_pollError) {
            if (!cancelled) {
              setError("Chatni yangilab bo'lmadi.");
            }
          }
        }, POLL_INTERVAL);
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message);
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [currentUser, fighter, isLoading]);

  useEffect(
    () => () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    },
    []
  );

  useEffect(() => {
    setPlayingAudioId('');
  }, [fighter.slug]);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Faylni o`qib bo`lmadi.'));
      reader.readAsDataURL(file);
    });

  const addFiles = async (files) => {
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

      setAttachments((prev) => [...prev, ...mappedAttachments]);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleFileChange = async (event) => {
    const { files } = event.target;
    if (files?.length) {
      await addFiles(files);
    }
    event.target.value = '';
  };

  const startRecording = async () => {
    setRecordingError('');

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordingError("Brauzer ovozli xabar yozishni qo'llab-quvvatlamaydi.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: blob.type });
        await addFiles([file]);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        recorderRef.current = null;
        chunksRef.current = [];
        setIsRecording(false);
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (_requestError) {
      setRecordingError("Mikrofonga ruxsat berilmadi yoki yozib bo'lmadi.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  };

  const removeAttachment = (attachmentId) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== attachmentId));
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
      setError("Audio xabarni ijro qilib bo'lmadi.");
    }
  };

  const handleComposerKeyDown = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await handleSend();
    }
  };

  const handleSend = async () => {
    if (!thread?.id || isSending) {
      return;
    }

    const trimmedText = messageText.trim();

    if (!trimmedText && attachments.length === 0) {
      return;
    }

    setIsSending(true);
    setError('');

    try {
      const response = await postChatMessage(thread.id, {
        senderType: 'user',
        text: trimmedText,
        attachments: attachments.map(({ type, name, url }) => ({ type, name, url })),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar || ''
      });

      setThread(response.thread);
      setMessageText('');
      setAttachments([]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !currentUser) {
    return null;
  }

  return (
    <main className="fighter-chat-page">
      <Navbar />

      <section className="fighter-chat">
        <div className="fighter-chat__container">
          <div className="fighter-chat__hero">
            <button type="button" className="fighter-chat__back" onClick={() => navigate(-1)}>
              {'< '}Orqaga
            </button>

            <div className="fighter-chat__hero-card">
              <div className="fighter-chat__hero-main">
                <div className="fighter-chat__avatar">
                  <img src={fighter.image} alt={fighter.fullName} />
                  <span className="fighter-chat__online-dot" />
                </div>
                <div>
                  <span className="fighter-chat__eyebrow">Jangchi bilan chat</span>
                  <h1>{fighter.fullName}</h1>
                  <p>
                    {fighter.category} • {fighter.city} • Tez javob berish uchun admin paneldan
                    fighter nomidan yoziladi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="fighter-chat__layout">
            <section className="fighter-chat__thread">
              <div className="fighter-chat__thread-head">
                <button
                  type="button"
                  className="fighter-chat__thread-profile-card"
                  onClick={() => navigate(`/jangchi/${fighter.slug}/profile`)}
                >
                  <div className="fighter-chat__thread-profile-avatar">
                    <img src={fighterProfile.image} alt={fighterProfile.name} />
                  </div>
                  <strong>{fighter.fullName}</strong>
                  <span>{fighterProfile.username}</span>
                </button>
                <button
                  type="button"
                  className="fighter-chat__thread-profile"
                  onClick={() => navigate(`/jangchi/${fighter.slug}/profile`)}
                >
                  Profilni ko`rish
                </button>
              </div>

              <div className="fighter-chat__messages" ref={messagesContainerRef}>
                {isBootstrapping ? (
                  <p className="fighter-chat__state">Chat tayyorlanmoqda...</p>
                ) : thread?.messages?.length ? (
                  thread.messages.map((message) => (
                    <article
                      key={message.id}
                      className={`fighter-chat__bubble ${
                        message.senderType === 'user' ? 'is-user' : 'is-fighter'
                      }`}
                    >
                      <div className="fighter-chat__bubble-main">
                        {message.text ? <p>{message.text}</p> : null}

                        {message.attachments?.length ? (
                          <div className="fighter-chat__attachments">
                            {message.attachments.map((attachment) => (
                              <div key={`${message.id}-${attachment.url}`} className="fighter-chat__attachment">
                                {attachment.type === 'image' ? (
                                  <img src={attachment.url} alt={attachment.name || 'Rasm'} />
                                ) : null}

                                {attachment.type === 'video' ? (
                                  <video controls src={attachment.url} />
                                ) : null}

                                {attachment.type === 'audio' ? (
                                  <div className="fighter-chat__audio">
                                    <button
                                      type="button"
                                      className={`fighter-chat__audio-play ${
                                        playingAudioId === `${message.id}-${attachment.url}` ? 'is-playing' : ''
                                      }`}
                                      onClick={() => toggleAudioPlayback(`${message.id}-${attachment.url}`)}
                                    >
                                      {playingAudioId === `${message.id}-${attachment.url}` ? '||' : '>'}
                                    </button>
                                    <div className="fighter-chat__audio-copy">
                                      <strong>{attachment.name || 'Ovozli xabar'}</strong>
                                      <span>Play tugmasi orqali tinglang</span>
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
                      </div>

                      <div className="fighter-chat__meta">
                        <span>{formatTime(message.createdAt)}</span>
                        {message.senderType === 'user' ? (
                          <strong className={message.readByFighter ? 'is-read' : ''}>
                            {getStatusMark(message)}
                          </strong>
                        ) : null}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="fighter-chat__state">
                    Hozircha xabar yo&apos;q. Birinchi xabarni yuborib suhbatni boshlang.
                  </p>
                )}
              </div>

              <div className="fighter-chat__composer">
                {attachments.length ? (
                  <div className="fighter-chat__attachment-strip">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="fighter-chat__attachment-chip">
                        <span>{attachment.name}</span>
                        <button type="button" onClick={() => removeAttachment(attachment.id)}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                <textarea
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  placeholder="Xabar yozing..."
                  rows={3}
                />

                <div className="fighter-chat__tools">
                  <div className="fighter-chat__tool-buttons">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileChange}
                    />
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      hidden
                      onChange={handleFileChange}
                    />
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      hidden
                      onChange={handleFileChange}
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
                    {!isRecording ? (
                      <button type="button" onClick={startRecording}>
                        Ovoz yozish
                      </button>
                    ) : (
                      <button type="button" className="is-recording" onClick={stopRecording}>
                        To&apos;xtatish
                      </button>
                    )}
                  </div>

                  <button type="button" className="fighter-chat__send" onClick={handleSend}>
                    {isSending ? 'Yuborilmoqda...' : 'Yuborish'}
                  </button>
                </div>

                {error ? <p className="fighter-chat__feedback is-error">{error}</p> : null}
                {recordingError ? (
                  <p className="fighter-chat__feedback is-error">{recordingError}</p>
                ) : null}
                {isRecording ? (
                  <p className="fighter-chat__feedback is-live">Ovoz yozilmoqda...</p>
                ) : null}
              </div>
            </section>

            <aside className="fighter-chat__side">
              <div className="fighter-chat__side-card">
                <h2>Chat imkoniyatlari</h2>
                <ul>
                  <li>Yuborilgan xabarlarda vaqt va o&apos;qilgan belgisi chiqadi.</li>
                  <li>Rasm, video, audio va ovoz yozib yuborish mumkin.</li>
                </ul>
              </div>

              <div className="fighter-chat__side-card">
                <h2>Jangchi haqida</h2>
                <p>{fighter.about}</p>
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

export default FighterChatPage;
