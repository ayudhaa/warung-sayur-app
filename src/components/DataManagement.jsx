import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DataManagement = ({ dataStore }) => {
  const { user } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [backupData, setBackupData] = useState(null);

  const handleClearData = (type) => {
    setActionType(type);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    switch (actionType) {
      case 'clear-products':
        dataStore.clearAllProducts();
        break;
      case 'clear-sales':
        dataStore.clearAllSales();
        break;
      case 'clear-purchases':
        dataStore.clearAllPurchases();
        break;
      case 'clear-all':
        dataStore.clearAllData();
        break;
      case 'reset-all':
        dataStore.resetAllData();
        break;
      default:
        break;
    }
    setShowConfirmDialog(false);
    setActionType('');
  };

  const exportData = () => {
    const data = {
      products: dataStore.products,
      sales: dataStore.sales,
      purchases: dataStore.purchases,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `backup-warung-sayur-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validasi data
        if (!importedData.products || !importedData.sales || !importedData.purchases) {
          alert('Format file backup tidak valid!');
          return;
        }

        setBackupData(importedData);
        setActionType('import');
        setShowConfirmDialog(true);
      } catch (error) {
        alert('Error membaca file: ' + error.message);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const confirmImport = () => {
    if (backupData) {
      dataStore.setProducts(backupData.products);
      dataStore.setSales(backupData.sales);
      dataStore.setPurchases(backupData.purchases);
      setBackupData(null);
    }
    setShowConfirmDialog(false);
    setActionType('');
  };

  const getActionMessage = () => {
    switch (actionType) {
      case 'clear-products':
        return 'Apakah Anda yakin ingin menghapus SEMUA data produk? Tindakan ini tidak dapat dibatalkan!';
      case 'clear-sales':
        return 'Apakah Anda yakin ingin menghapus SEMUA data penjualan? Tindakan ini tidak dapat dibatalkan!';
      case 'clear-purchases':
        return 'Apakah Anda yakin ingin menghapus SEMUA data pembelian? Tindakan ini tidak dapat dibatalkan!';
      case 'clear-all':
        return 'Apakah Anda yakin ingin menghapus SEMUA data (produk, penjualan, pembelian)? Tindakan ini tidak dapat dibatalkan!';
      case 'reset-all':
        return 'Apakah Anda yakin ingin mereset SEMUA data ke kondisi awal? Data saat ini akan hilang!';
      case 'import':
        return 'Apakah Anda yakin ingin mengimpor data backup? Data saat ini akan digantikan!';
      default:
        return '';
    }
  };

  const stats = dataStore.getStatistics();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelola Data Warung Sayur</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Produk</h3>
          <p className="text-3xl font-bold text-blue-600">{dataStore.products.length} item</p>
          <p className="text-sm text-gray-600 mt-2">
            {stats.lowStockProducts} produk stok rendah
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Penjualan</h3>
          <p className="text-3xl font-bold text-green-600">{dataStore.sales.length} transaksi</p>
          <p className="text-sm text-gray-600 mt-2">
            Total: Rp {stats.totalSales.toLocaleString('id-ID')}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Pembelian</h3>
          <p className="text-3xl font-bold text-yellow-600">{dataStore.purchases.length} transaksi</p>
          <p className="text-sm text-gray-600 mt-2">
            Total: Rp {stats.totalPurchases.toLocaleString('id-ID')}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Laba/Rugi</h3>
          <p className={`text-3xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Rp {stats.profit.toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-gray-600 mt-2">Selisih penjualan - pembelian</p>
        </div>
      </div>

      {/* Backup & Restore Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Backup & Restore Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border-2 border-dashed border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Ekspor Data (Backup)</h4>
            <p className="text-sm text-gray-600 mb-4">
              Simpan salinan data Anda untuk berjaga-jaga. Data akan disimpan dalam format JSON.
            </p>
            <button
              onClick={exportData}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ekspor Data ke File
            </button>
          </div>
          
          <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Impor Data (Restore)</h4>
            <p className="text-sm text-gray-600 mb-4">
              Pulihkan data dari file backup sebelumnya. Data saat ini akan digantikan.
            </p>
            <label className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Impor Data dari File
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5" />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800">Perhatian!</p>
              <p className="text-sm text-yellow-700">
                Backup data Anda secara rutin untuk menghindari kehilangan data. Data disimpan di browser Anda dan dapat hilang jika cache dibersihkan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management Actions */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Manajemen Data</h3>
        <p className="text-gray-600 mb-6">Hati-hati dengan tindakan berikut. Beberapa tindakan tidak dapat dibatalkan.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleClearData('clear-products')}
            className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition duration-300"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-red-700">Hapus Semua Produk</p>
                <p className="text-sm text-gray-600">{dataStore.products.length} produk akan dihapus</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleClearData('clear-sales')}
            className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition duration-300"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-red-700">Hapus Semua Penjualan</p>
                <p className="text-sm text-gray-600">{dataStore.sales.length} transaksi akan dihapus</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleClearData('clear-purchases')}
            className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition duration-300"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-red-700">Hapus Semua Pembelian</p>
                <p className="text-sm text-gray-600">{dataStore.purchases.length} transaksi akan dihapus</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleClearData('clear-all')}
            className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition duration-300"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-red-700">Hapus SEMUA Data</p>
                <p className="text-sm text-gray-600">Semua data akan dihapus permanen</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleClearData('reset-all')}
            className="p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition duration-300"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 15m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-yellow-700">Reset ke Data Awal</p>
                <p className="text-sm text-gray-600">Kembali ke data contoh/default</p>
              </div>
            </div>
          </button>
          
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-green-700">Data Tersimpan Aman</p>
                <p className="text-sm text-gray-600">Data otomatis tersimpan di browser</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Tindakan</h3>
            <p className="text-gray-700 mb-6">{getActionMessage()}</p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setActionType('');
                  setBackupData(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-300"
              >
                Batal
              </button>
              <button
                onClick={actionType === 'import' ? confirmImport : confirmAction}
                className={`flex-1 font-semibold py-3 px-4 rounded-lg transition duration-300 ${
                  actionType === 'import' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {actionType === 'import' ? 'Impor Data' : 'Ya, Hapus Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;