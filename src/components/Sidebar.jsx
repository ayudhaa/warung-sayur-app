import React from 'react';
import { useAuth } from '../context/AuthContext';
import useWindowSize from '../hooks/useWindowSize';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const { width } = useWindowSize();
  
  // Hide sidebar on mobile
  if (width < 1024) {
    return null;
  }

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', roles: ['admin', 'kasir'] },
    { id: 'sales', name: 'Penjualan', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', roles: ['admin', 'kasir'] },
    { id: 'purchase', name: 'Pembelian', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', roles: ['admin'] },
    { id: 'inventory', name: 'Stok Barang', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', roles: ['admin', 'kasir'] },
    { id: 'report', name: 'Laporan', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', roles: ['admin'] },
    { 
        id: 'data-management', 
        name: 'Kelola Data', 
        icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
        roles: ['admin'] 
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = user 
    ? menuItems.filter(item => item.roles.includes(user.role))
    : [];

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg hidden lg:block">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Menu Navigasi</h2>
          {user && (
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="mr-3 bg-green-600 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-800">{user.name}</p>
                <p className="text-sm text-green-600 capitalize">{user.role}</p>
              </div>
            </div>
          )}
        </div>
        
        <nav>
          <ul className="space-y-2">
            {filteredMenuItems.map(item => (
              <li key={item.id}>
                <button
                  className={`flex items-center w-full p-3 rounded-lg ${activeTab === item.id ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Tips Section */}
        <div className="mt-10 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Tips Warung Sayur</h3>
          <p className="text-sm text-green-700">
            {user?.role === 'admin' 
              ? 'Periksa stok minimal 2x sehari dan catat semua transaksi.'
              : 'Selalu berikan struk kepada pelanggan dan verifikasi stok sebelum penjualan.'}
          </p>
        </div>

        {/* Logout Button */}
        {user && (
          <button
            onClick={logout}
            className="flex items-center w-full p-3 mt-6 rounded-lg text-red-600 hover:bg-red-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar dari Sistem
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;