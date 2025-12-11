import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SalesForm = ({ products, sales, setSales, addSale, setProducts, navigateTo }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    customer: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.quantity || formData.quantity <= 0) {
      alert('Harap lengkapi semua field dengan benar!');
      return;
    }

    const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
    
    if (!selectedProduct) {
      alert('Produk tidak ditemukan!');
      return;
    }

    if (selectedProduct.stock < parseInt(formData.quantity)) {
      alert(`Stok ${selectedProduct.name} tidak cukup! Stok tersedia: ${selectedProduct.stock}`);
      return;
    }

    const newSale = {
      date: formData.date,
      productId: parseInt(formData.productId),
      productName: selectedProduct.name,
      quantity: parseInt(formData.quantity),
      totalPrice: parseInt(formData.quantity) * selectedProduct.sellPrice,
      customer: formData.customer || 'Pelanggan Umum',
      cashier: user?.username || 'kasir'
    };

    // Add sale to data store
    addSale(newSale);
    
    // Update product stock
    const updatedProducts = products.map(p => {
      if (p.id === parseInt(formData.productId)) {
        return { 
          ...p, 
          stock: p.stock - parseInt(formData.quantity),
          lastUpdated: new Date().toISOString().split('T')[0],
          updatedBy: user?.username || 'kasir'
        };
      }
      return p;
    });
    
    setProducts(updatedProducts);
    
    // Reset form
    setFormData({
      productId: '',
      quantity: '',
      customer: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    alert('Penjualan berhasil dicatat!');
  };

  // Calculate totals
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalTransactions = sales.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Form Penjualan</h2>
        <div className={`px-4 py-2 rounded-lg font-semibold ${sales.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {sales.length > 0 
            ? `Total Penjualan: Rp ${totalSales.toLocaleString('id-ID')}`
            : 'Belum ada transaksi'
          }
        </div>
      </div>
      
      {/* Empty State - Jika belum ada produk */}
      {products.length === 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-200 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-yellow-100 text-yellow-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Belum Ada Produk</h3>
            <p className="text-gray-600 mb-4">Anda perlu menambahkan produk terlebih dahulu sebelum bisa melakukan penjualan.</p>
            <button
            onClick={() => navigateTo('inventory')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
            Tambah Produk
            </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Penjualan */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Catat Penjualan Baru</h3>
            
            {products.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Tidak ada produk yang tersedia untuk dijual.</p>
                <p className="text-sm text-gray-500 mt-2">Tambahkan produk terlebih dahulu di menu Stok Barang.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="date">
                    Tanggal Penjualan
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="productId">
                    Pilih Produk
                  </label>
                  <select
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">-- Pilih Produk --</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stok: {product.stock} {product.unit}, Harga: Rp {product.sellPrice.toLocaleString('id-ID')})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="quantity">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: 5"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="customer">
                    Nama Pelanggan (Opsional)
                  </label>
                  <input
                    type="text"
                    id="customer"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: Pak Budi"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                >
                  Catat Penjualan
                </button>
              </form>
            )}
            
            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Statistik Cepat</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
                  <p className="text-xs text-blue-700">Total Transaksi</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{products.length}</p>
                  <p className="text-xs text-green-700">Produk Tersedia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Riwayat Penjualan */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">Riwayat Penjualan</h3>
                <div className="text-sm text-gray-600">
                {sales.length > 0 
                    ? `${sales.length} transaksi` 
                    : 'Belum ada transaksi'
                }
                </div>
            </div>
        
        {sales.length > 0 ? (
            <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {[...sales]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(sale => (
                        <tr key={sale.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm">{sale.date}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm">
                            <div>
                            <p className="font-medium">{sale.productName}</p>
                            <p className="text-xs text-gray-500">{sale.quantity} pcs</p>
                            </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm">{sale.customer || '-'}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm">{sale.quantity}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm font-semibold text-green-600">
                            Rp {sale.totalPrice.toLocaleString('id-ID')}
                        </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </>
        ) : (
            <div className="text-center p-6 md:p-8 bg-gray-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gray-100 text-gray-400 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <h4 className="text-base md:text-xl font-bold text-gray-700 mb-2">Belum Ada Riwayat Penjualan</h4>
            <p className="text-gray-600 text-sm md:text-base mb-4">
                Mulai catat penjualan pertama Anda menggunakan form di samping
            </p>
            <div className="max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-semibold text-green-800">📝 Form Penjualan</p>
                    <p className="text-green-700">Catat setiap transaksi</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-semibold text-blue-800">💾 Auto Save</p>
                    <p className="text-blue-700">Data otomatis tersimpan</p>
                </div>
                </div>
            </div>
            </div>
        )}
        
        {/* Info Penyimpanan */}
        {sales.length === 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                <p className="font-semibold text-gray-800">Data akan tersimpan otomatis</p>
                <p className="text-sm text-gray-600">
                    Setiap penjualan yang Anda catat akan otomatis tersimpan di browser. 
                    Data akan tetap ada meski browser ditutup.
                </p>
                </div>
            </div>
            </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default SalesForm;