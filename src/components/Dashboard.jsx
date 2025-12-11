import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = ({ products, sales, purchases, navigateTo }) => {
  const { user } = useAuth();
  
  // Calculate totals
  const totalProducts = products.length;
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);
  const profit = totalSales - totalPurchases;
  
  // Low stock products
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);
  
  // Recent sales (last 5 transactions)
  const recentSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Check if all data is empty
  const isEmpty = products.length === 0 && sales.length === 0 && purchases.length === 0;

  // Calculate today's sales
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(sale => sale.date === today)
    .reduce((sum, sale) => sum + sale.totalPrice, 0);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-responsive-2xl font-bold text-gray-800">Dashboard Warung Sayur</h1>
        <p className="text-gray-600 mt-1 text-responsive-sm">
          Selamat datang, {user?.name}! • {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      {/* Empty State - Mobile Optimized */}
      {isEmpty && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-blue-100 text-blue-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Selamat Datang di Warung Sayur!</h3>
          <p className="text-gray-600 mb-6 text-responsive-base">Mulai kelola usaha Anda dengan menambahkan data pertama</p>
          
          {/* Responsive Grid for Quick Start */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto">
            <div className="bg-white p-3 md:p-4 rounded-lg shadow text-center">
              <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">1</div>
              <p className="font-medium text-sm md:text-base">Tambahkan Produk</p>
              <p className="text-gray-500 text-xs md:text-sm">Menu Stok Barang</p>
              <button
                onClick={() => navigateTo('inventory')}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm font-medium py-2 px-4 rounded-lg transition-all w-full"
              >
                Tambah Produk
              </button>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-lg shadow text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">2</div>
              <p className="font-medium text-sm md:text-base">Catat Penjualan</p>
              <p className="text-gray-500 text-xs md:text-sm">Setelah ada produk</p>
              <button
                onClick={() => navigateTo('sales')}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-medium py-2 px-4 rounded-lg transition-all w-full"
                disabled={products.length === 0}
                style={{ opacity: products.length === 0 ? 0.5 : 1, cursor: products.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                {products.length === 0 ? 'Tambah Produk Dulu' : 'Mulai Penjualan'}
              </button>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-lg shadow text-center">
              <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">3</div>
              <p className="font-medium text-sm md:text-base">Lihat Laporan</p>
              <p className="text-gray-500 text-xs md:text-sm">Pantau perkembangan</p>
              <button
                onClick={() => navigateTo('report')}
                className="mt-3 bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm font-medium py-2 px-4 rounded-lg transition-all w-full"
                disabled={sales.length === 0}
                style={{ opacity: sales.length === 0 ? 0.5 : 1, cursor: sales.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                {sales.length === 0 ? 'Belum Ada Data' : 'Lihat Laporan'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Product Card */}
        <div className="card-responsive">
          <div className="flex items-center">
            <div className={`p-2 md:p-3 ${totalProducts > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'} rounded-lg mr-3 md:mr-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Total Produk</p>
              <p className="text-xl md:text-2xl font-bold">{totalProducts}</p>
              <p className="text-xs text-gray-500 mt-1">
                {lowStockProducts.length} stok rendah
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('inventory')}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all"
          >
            Kelola Produk
          </button>
        </div>
        
        {/* Sales Card */}
        <div className="card-responsive">
          <div className="flex items-center">
            <div className={`p-2 md:p-3 ${sales.length > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} rounded-lg mr-3 md:mr-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Total Penjualan</p>
              <p className="text-xl md:text-2xl font-bold">Rp {totalSales.toLocaleString('id-ID')}</p>
              <p className="text-xs text-gray-500 mt-1">
                {sales.length} transaksi
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('sales')}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all"
            disabled={products.length === 0}
            style={{ opacity: products.length === 0 ? 0.5 : 1, cursor: products.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            {products.length === 0 ? 'Tambah Produk Dulu' : 'Catat Penjualan'}
          </button>
        </div>
        
        {/* Purchase Card */}
        <div className="card-responsive">
          <div className="flex items-center">
            <div className={`p-2 md:p-3 ${purchases.length > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'} rounded-lg mr-3 md:mr-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Total Pembelian</p>
              <p className="text-xl md:text-2xl font-bold">Rp {totalPurchases.toLocaleString('id-ID')}</p>
              <p className="text-xs text-gray-500 mt-1">
                {purchases.length} transaksi
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('purchase')}
            className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all"
            disabled={products.length === 0}
            style={{ opacity: products.length === 0 ? 0.5 : 1, cursor: products.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            {products.length === 0 ? 'Tambah Produk Dulu' : 'Tambah Pembelian'}
          </button>
        </div>
        
        {/* Profit Card */}
        <div className="card-responsive">
          <div className="flex items-center">
            <div className={`p-2 md:p-3 ${profit >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-lg mr-3 md:mr-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Laba/Rugi</p>
              <p className={`text-xl md:text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Rp {profit.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {profit >= 0 ? 'Laba' : 'Rugi'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('report')}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all"
            disabled={sales.length === 0}
            style={{ opacity: sales.length === 0 ? 0.5 : 1, cursor: sales.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            {sales.length === 0 ? 'Belum Ada Data' : 'Lihat Laporan'}
          </button>
        </div>
      </div>
      
      {/* Quick Stats Row - Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white p-3 md:p-4 rounded-lg shadow border text-center">
          <p className="text-gray-600 text-xs md:text-sm">Hari Ini</p>
          <p className="text-lg md:text-xl font-bold text-blue-600">Rp {todaySales.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow border text-center">
          <p className="text-gray-600 text-xs md:text-sm">Rata-rata</p>
          <p className="text-lg md:text-xl font-bold text-purple-600">
            Rp {sales.length > 0 ? Math.round(totalSales / sales.length).toLocaleString('id-ID') : '0'}
          </p>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow border text-center">
          <p className="text-gray-600 text-xs md:text-sm">Item Terjual</p>
          <p className="text-lg md:text-xl font-bold text-green-600">
            {sales.reduce((total, sale) => total + sale.quantity, 0)}
          </p>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow border text-center">
          <p className="text-gray-600 text-xs md:text-sm">Stok Aman</p>
          <p className="text-lg md:text-xl font-bold text-orange-600">
            {products.length - lowStockProducts.length}
          </p>
        </div>
      </div>
      
      {/* Main Content Grid - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column - Stock Alert & Recent Sales */}
        <div className="space-y-6 md:space-y-8">
          {/* Stock Alert - Responsive */}
          <div className="card-responsive">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Stok Hampir Habis</h3>
              <span className={`px-2 md:px-3 py-1 text-xs font-semibold rounded-full ${lowStockProducts.length > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {lowStockProducts.length} produk
              </span>
            </div>
            
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 3).map(product => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm md:text-base truncate">{product.name}</p>
                      <p className="text-gray-600 text-xs md:text-sm">Stok: {product.stock} {product.unit}</p>
                    </div>
                    <div className="text-right ml-3">
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 md:px-3 py-1 rounded-full whitespace-nowrap">
                        Perlu Restock
                      </span>
                    </div>
                  </div>
                ))}
                
                {lowStockProducts.length > 3 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-600">
                      + {lowStockProducts.length - 3} produk lainnya
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-4 md:p-6 bg-green-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 mx-auto text-green-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-700 font-medium text-sm md:text-base">Semua stok aman!</p>
                <p className="text-green-600 text-xs md:text-sm mt-1">Tidak ada produk stok rendah</p>
              </div>
            )}
            
            {/* Restock Button */}
            <div className="mt-6">
              <button
                onClick={() => navigateTo('inventory')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 md:py-3 px-4 rounded-lg transition-all-responsive flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm md:text-base">Kelola Stok</span>
              </button>
            </div>
          </div>
          
          {/* Recent Sales - Responsive */}
          <div className="card-responsive">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Penjualan Terbaru</h3>
              <span className="px-2 md:px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                {sales.length} transaksi
              </span>
            </div>
            
            {recentSales.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentSales.map(sale => (
                        <tr key={sale.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm">{sale.date}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                                {sale.productName}
                              </p>
                              <p className="text-gray-500 text-xs">{sale.quantity} pcs</p>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm font-semibold text-green-600">
                            Rp {sale.totalPrice.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* View All Button */}
                <div className="mt-6">
                  <button
                    onClick={() => navigateTo('sales')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 md:py-3 px-4 rounded-lg transition-all-responsive flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-sm md:text-base">Lihat Semua Penjualan</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-base md:text-xl font-bold text-gray-700 mb-2">Belum Ada Penjualan</h4>
                <p className="text-gray-600 text-sm md:text-base mb-4">Mulai catat penjualan pertama Anda</p>
                <button
                  onClick={() => navigateTo('sales')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-all-responsive text-sm md:text-base"
                  disabled={products.length === 0}
                  style={{ opacity: products.length === 0 ? 0.5 : 1, cursor: products.length === 0 ? 'not-allowed' : 'pointer' }}
                >
                  {products.length === 0 ? 'Tambah Produk Dulu' : 'Mulai Penjualan'}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Quick Stats & Actions */}
        <div className="space-y-6 md:space-y-8">
          {/* Quick Stats Panel - Responsive */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-100 p-4 md:p-6 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 text-base md:text-lg">📈 Statistik Cepat</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-700 text-sm md:text-base">Produk Tersedia</span>
                <span className="font-bold text-blue-800 text-base md:text-lg">{totalProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700 text-sm md:text-base">Total Penjualan</span>
                <span className="font-bold text-blue-800 text-base md:text-lg">{sales.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700 text-sm md:text-base">Stok Rendah</span>
                <span className="font-bold text-red-600 text-base md:text-lg">{lowStockProducts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700 text-sm md:text-base">Laba/Rugi</span>
                <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'} text-base md:text-lg`}>
                  Rp {Math.abs(profit).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions - Responsive */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 md:p-6 rounded-xl border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 text-base md:text-lg">🚀 Mulai Cepat</h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigateTo('inventory')}
                className="text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-all-responsive border border-green-200"
              >
                <div className="flex items-center mb-2">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="font-medium text-green-700 text-sm">Tambah Produk</span>
                </div>
                <p className="text-green-600 text-xs">Tambah produk baru</p>
              </button>
              
              <button 
                onClick={() => navigateTo('sales')}
                className="text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-all-responsive border border-green-200"
                disabled={products.length === 0}
                style={{ opacity: products.length === 0 ? 0.5 : 1, cursor: products.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-blue-700 text-sm">Catat Penjualan</span>
                </div>
                <p className="text-blue-600 text-xs">Transaksi baru</p>
              </button>
              
              <button 
                onClick={() => navigateTo('purchase')}
                className="text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-all-responsive border border-green-200"
                disabled={products.length === 0}
                style={{ opacity: products.length === 0 ? 0.5 : 1, cursor: products.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-yellow-700 text-sm">Tambah Pembelian</span>
                </div>
                <p className="text-yellow-600 text-xs">Restock dari supplier</p>
              </button>
              
              <button 
                onClick={() => navigateTo('report')}
                className="text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-all-responsive border border-green-200"
                disabled={sales.length === 0}
                style={{ opacity: sales.length === 0 ? 0.5 : 1, cursor: sales.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-purple-700 text-sm">Lihat Laporan</span>
                </div>
                <p className="text-purple-600 text-xs">Analisis performa</p>
              </button>
            </div>
          </div>
          
          {/* Tips Panel - Responsive */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-100 p-4 md:p-6 rounded-xl border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3 text-base md:text-lg">💡 Tips Hari Ini</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-purple-700 text-sm md:text-base">Periksa Stok Rutin</p>
                  <p className="text-purple-600 text-xs md:text-sm">Cek stok minimal 2x sehari</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-purple-700 text-sm md:text-base">Backup Data</p>
                  <p className="text-purple-600 text-xs md:text-sm">Ekspor data rutin setiap minggu</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-purple-700 text-sm md:text-base">Catat Semua Transaksi</p>
                  <p className="text-purple-600 text-xs md:text-sm">Setiap transaksi penting untuk laporan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;