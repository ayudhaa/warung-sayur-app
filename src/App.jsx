import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileMenu from './components/MobileMenu';
import Dashboard from './components/Dashboard';
import SalesForm from './components/SalesForm';
import PurchaseForm from './components/PurchaseForm';
import Inventory from './components/Inventory';
import FinancialReport from './components/FinancialReport';
import Login from './components/Login';
import DataManagement from './components/DataManagement';
import useDataStore from './hooks/useDataStore';
import useWindowSize from './hooks/useWindowSize';

// Responsive Content Wrapper
const ResponsiveContent = ({ children, width }) => {
  // Responsive padding based on screen size
  const getPadding = () => {
    if (width < 640) return 'p-3'; // Mobile
    if (width < 1024) return 'p-4'; // Tablet
    return 'p-6'; // Desktop
  };
  
  // Responsive container width
  const getContainerClass = () => {
    if (width < 640) return 'max-w-full px-3'; // Mobile: full width with small padding
    if (width < 768) return 'max-w-full px-4'; // Small tablet
    if (width < 1024) return 'max-w-4xl px-6'; // Tablet
    if (width < 1280) return 'max-w-6xl px-8'; // Small desktop
    return 'max-w-7xl px-8'; // Large desktop
  };
  
  return (
    <main className={`flex-1 ${getPadding()} overflow-auto`}>
      <div className={getContainerClass()}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          {children}
        </div>
      </div>
    </main>
  );
};

// Main App Component
function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { width } = useWindowSize();
  
  // Gunakan custom hook untuk data management
  const dataStore = useDataStore();

  // Auto-close mobile menu on desktop
  useEffect(() => {
    if (width >= 1024 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [width, isMobileMenuOpen]);

  // Navigation handler untuk semua button
  const navigateTo = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu jika terbuka
  };

  const renderContent = () => {
    if (!user) {
      return <Login />;
    }

    // Pass navigation handler ke setiap komponen
    const navigationProps = { navigateTo };

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          products={dataStore.products} 
          sales={dataStore.sales} 
          purchases={dataStore.purchases}
          navigateTo={navigateTo}
        />;
      case 'sales':
        return <SalesForm 
          products={dataStore.products} 
          sales={dataStore.sales} 
          setSales={dataStore.setSales}
          addSale={dataStore.addSale}
          setProducts={dataStore.setProducts}
          navigateTo={navigateTo}
        />;
      case 'purchase':
        return <PurchaseForm 
          products={dataStore.products} 
          purchases={dataStore.purchases} 
          setPurchases={dataStore.setPurchases}
          addPurchase={dataStore.addPurchase}
          setProducts={dataStore.setProducts}
          navigateTo={navigateTo}
        />;
      case 'inventory':
        return <Inventory 
          products={dataStore.products} 
          setProducts={dataStore.setProducts}
          addProduct={dataStore.addProduct}
          deleteProduct={dataStore.deleteProduct}
          updateProduct={dataStore.updateProduct}
          navigateTo={navigateTo}
        />;
      case 'report':
        return <FinancialReport 
          sales={dataStore.sales} 
          purchases={dataStore.purchases} 
          products={dataStore.products}
          navigateTo={navigateTo}
        />;
      case 'data-management':
        return <DataManagement 
          dataStore={dataStore}
          navigateTo={navigateTo}
        />;
      default:
        return <Dashboard 
          products={dataStore.products} 
          sales={dataStore.sales} 
          purchases={dataStore.purchases}
          navigateTo={navigateTo}
        />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Login />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        setActiveTab={setActiveTab} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <MobileMenu 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Main Content */}
        <ResponsiveContent width={width}>
          {renderContent()}
          
          {/* Responsive Footer */}
          <footer className={`mt-6 md:mt-8 pt-6 border-t border-gray-200 text-center text-gray-600 ${width < 640 ? 'text-xs' : 'text-sm'}`}>
            {/* <p>Aplikasi Pencatatan Usaha Warung Sayur &copy; {new Date().getFullYear()}</p> */}
            <p>made with♥️</p>
          </footer>
        </ResponsiveContent>
      </div>
      
      {/* Bottom Navigation for Mobile */}
      {width < 1024 && user && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-lg">
          <div className="flex justify-around p-2">
            {[
              { id: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
              { id: 'sales', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Jual' },
              { id: 'inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: 'Stok' },
              { id: 'report', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Laporan' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg ${activeTab === item.id ? 'text-green-600 bg-green-50' : 'text-gray-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap with AuthProvider
const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;