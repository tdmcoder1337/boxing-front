const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "So'rovni bajarib bo'lmadi.");
  }

  return data;
};

export const startChatThread = (payload) =>
  request('/chats/start', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const getChatThreads = ({ viewer, userId } = {}) => {
  const searchParams = new URLSearchParams();

  if (viewer) {
    searchParams.set('viewer', viewer);
  }

  if (userId) {
    searchParams.set('userId', userId);
  }

  const query = searchParams.toString();
  return request(`/chats${query ? `?${query}` : ''}`);
};

export const getChatThread = (threadId, { viewer, userId } = {}) => {
  const searchParams = new URLSearchParams();

  if (viewer) {
    searchParams.set('viewer', viewer);
  }

  if (userId) {
    searchParams.set('userId', userId);
  }

  const query = searchParams.toString();
  return request(`/chats/${threadId}${query ? `?${query}` : ''}`);
};

export const postChatMessage = (threadId, payload) =>
  request(`/chats/${threadId}/messages`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
