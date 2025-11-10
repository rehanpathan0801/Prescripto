import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ToastContext } from './ToastContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useContext(ToastContext);
  
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${apiUrl}/auth/login`, { email, password });

      setUser(res.data.user);
      setToken(res.data.token);
      setLoading(false);
      addToast('Login successful!', 'success');
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
      setLoading(false);
      return false;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/auth/register`, { name, email, password });

      setLoading(false);
      addToast('Registration successful! Please login.', 'success');
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    addToast('Logged out successfully.', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}; 