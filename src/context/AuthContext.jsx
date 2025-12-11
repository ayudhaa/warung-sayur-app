import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('warung_sayur_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // In a real app, this would be an API call
    if (username === 'admin' && password === 'admin123') {
      const userData = {
        id: 1,
        username: 'admin',
        name: 'Administrator Warung Sayur',
        role: 'admin',
        email: 'admin@warungsayur.com'
      };
      setUser(userData);
      localStorage.setItem('warung_sayur_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else if (username === 'kasir' && password === 'kasir123') {
      const userData = {
        id: 2,
        username: 'kasir',
        name: 'Kasir Warung Sayur',
        role: 'kasir',
        email: 'kasir@warungsayur.com'
      };
      setUser(userData);
      localStorage.setItem('warung_sayur_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      return { success: false, message: 'Username atau password salah' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('warung_sayur_user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};