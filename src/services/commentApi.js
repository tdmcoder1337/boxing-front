const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
  } catch (_error) {
    throw new Error("Server bilan bog'lanib bo'lmadi. Backend serverni ishga tushiring.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "So'rovni bajarib bo'lmadi.");
  }

  return data;
};

export const getFighterComments = (slug) => request(`/fighters/${slug}/comments`);

export const createFighterComment = (slug, payload) =>
  request(`/fighters/${slug}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const updateFighterComment = (slug, commentId, payload) =>
  request(`/fighters/${slug}/comments/${commentId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });

export const deleteFighterComment = (slug, commentId, payload) =>
  request(`/fighters/${slug}/comments/${commentId}`, {
    method: 'DELETE',
    body: JSON.stringify(payload)
  });
