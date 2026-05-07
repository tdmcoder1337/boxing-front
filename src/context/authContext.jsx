import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile as updateUserProfileRequest
} from '../services/authApi';

const SESSION_KEY = 'boxing_current_user';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const savedUser = localStorage.getItem(SESSION_KEY);

      if (!savedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);
        const response = await getUserProfile(parsedUser.id);
        setCurrentUser(response.user);
        localStorage.setItem(SESSION_KEY, JSON.stringify(response.user));
      } catch (error) {
        localStorage.removeItem(SESSION_KEY);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const persistUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    persistUser(response.user);
    return response;
  };

  const login = async (payload) => {
    const response = await loginUser(payload);
    persistUser(response.user);
    return response;
  };



  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  };

  const refreshProfile = async () => {
    if (!currentUser?.id) {
      return null;
    }

    const response = await getUserProfile(currentUser.id);
    persistUser(response.user);
    return response.user;
  };

  const updateProfile = async (payload) => {
    if (!currentUser?.id) {
      throw new Error("Foydalanuvchi topilmadi.");
    }

    const response = await updateUserProfileRequest(currentUser.id, payload);
    persistUser(response.user);
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isAuthenticated: Boolean(currentUser),
        login,
        logout,
        refreshProfile,
        register,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth faqat AuthProvider ichida ishlatilishi kerak.');
  }

  return context;
}
