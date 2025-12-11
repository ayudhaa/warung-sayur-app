import React, { useState } from 'react';

const PurchaseForm = ({ products, purchases, setPurchases, addPurchase, setProducts, navigateTo }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    supplier: '',
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
    
    if (!formData.productId || !formData.quantity || formData.quantity <= 0 || !formData.supplier) {
      alert('Harap lengkapi semua field!');
      return;
    }

    const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
    
    if (!selectedProduct) {
      alert('Produk tidak ditemukan!');
      return;
    }

    const newPurchase = {
      id: purchases.length + 1,
      date: formData.date,
      productId: parseInt(formData.productId),
      productName: selectedProduct.name,
      quantity: parseInt(formData.quantity),
      totalPrice: parseInt(formData.quantity) * selectedProduct.buyPrice,
      supplier: formData.supplier
    };

    // Update purchases
    setPurchases([...purchases, newPurchase]);
    
    // Update product stock
    const updatedProducts = products.map(p => {
      if (p.id === parseInt(formData.productId)) {
        return { ...p, stock: p.stock + parseInt(formData.quantity) };
      }
      return p;
    });
    
    setProducts(updatedProducts);
    
    // Reset form
    setFormData({
      productId: '',
      quantity: '',
      supplier: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    alert('Pembelian berhasil dicatat!');
  };

  {products.length === 0 && (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-200 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-yellow-100 text-yellow-600 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Belum Ada Produk</h3>
      <p className="text-gray-600 mb-4">Tambahkan produk terlebih dahulu sebelum melakukan pembelian.</p>
      <button
        onClick={() => navigateTo('inventory')}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
      >
        Tambah Produk
      </button>
    </div>
  )}

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Form Pembelian</h2>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
          Total Pembelian: Rp {purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0).toLocaleString('id-ID')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Catat Pembelian Baru</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="date">
                  Tanggal Pembelian
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
                      {product.name} (Harga Beli: Rp {product.buyPrice.toLocaleString('id-ID')}/{product.unit})
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
                  placeholder="Contoh: 10"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="supplier">
                  Nama Supplier
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Contoh: Pasar Induk"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
              >
                Catat Pembelian
              </button>
            </form>
          </div>
        </div>
        
        {/* Purchase History */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Pembelian</h3>
            
            {purchases.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...purchases].reverse().map(purchase => (
                      <tr key={purchase.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{purchase.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{purchase.productName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{purchase.supplier}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{purchase.quantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">Rp {purchase.totalPrice.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-600">Belum ada data pembelian. Mulai catat pembelian Anda!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;