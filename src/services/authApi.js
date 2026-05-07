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

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (_error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || text || `So'rovni bajarib bo'lmadi. Status: ${response.status}`);
  }

  return data;
};

export const registerUser = (payload) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const loginUser = (payload) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const getUserProfile = (userId) => request(`/users/${userId}`);

export const updateUserProfile = (userId, payload) =>
  request(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
