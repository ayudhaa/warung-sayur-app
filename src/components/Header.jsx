import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useWindowSize from '../hooks/useWindowSize';

const Header = ({ setActiveTab, setIsMobileMenuOpen, products, sales }) => {
  const { user, logout } = useAuth();
  const { width } = useWindowSize();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  return (
    <header className="bg-green-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden mr-3 p-2 rounded-lg hover:bg-green-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="mr-3 bg-white text-green-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Warung Sayur Segar</h1>
            <p className="text-green-100 text-xs md:text-sm">Aplikasi Pencatatan Usaha</p>
          </div>
        </div>
        
        {/* User Info and Menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-700"
              >
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm md:text-base">{isMobile ? user.username : user.name}</p>
                  <p className="text-green-100 text-xs capitalize">{user.role}</p>
                </div>
                <div className="bg-green-800 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-40 py-2">
                    <div className="px-4 py-2 border-b">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-right">
              <p className="font-semibold text-sm md:text-base">Selamat Datang!</p>
              <p className="text-green-100 text-xs md:text-sm">Silakan login</p>
            </div>
          )}
          
          {/* Current Date */}
          <div className="hidden md:block text-right border-l pl-4">
            <p className="font-semibold text-sm">{new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</p>
            <p className="text-green-100 text-sm">{new Date().toLocaleDateString('id-ID')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;