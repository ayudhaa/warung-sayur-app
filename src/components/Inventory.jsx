import React, { useState } from 'react';

const Inventory = ({ products, setProducts, addProduct, deleteProduct, updateProduct, navigateTo }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    stock: '',
    unit: '',
    buyPrice: '',
    sellPrice: '',
    minStock: ''
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newProduct.name || !newProduct.category || !newProduct.stock || !newProduct.unit || 
        !newProduct.buyPrice || !newProduct.sellPrice || !newProduct.minStock) {
      alert('Harap lengkapi semua field!');
      return;
    }

    if (parseInt(newProduct.buyPrice) >= parseInt(newProduct.sellPrice)) {
      alert('Harga jual harus lebih tinggi dari harga beli!');
      return;
    }

    const productToAdd = {
      name: newProduct.name,
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      unit: newProduct.unit,
      buyPrice: parseInt(newProduct.buyPrice),
      sellPrice: parseInt(newProduct.sellPrice),
      minStock: parseInt(newProduct.minStock)
    };

    addProduct(productToAdd);
    
    // Reset form
    setNewProduct({
      name: '',
      category: '',
      stock: '',
      unit: '',
      buyPrice: '',
      sellPrice: '',
      minStock: ''
    });
    
    alert('Produk berhasil ditambahkan!');
  };

  const handleEdit = (product) => {
    setEditingProduct({...product});
    setNewProduct({
      name: product.name,
      category: product.category,
      stock: product.stock.toString(),
      unit: product.unit,
      buyPrice: product.buyPrice.toString(),
      sellPrice: product.sellPrice.toString(),
      minStock: product.minStock.toString()
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    if (!editingProduct) return;
    
    const updatedProduct = {
      ...editingProduct,
      name: newProduct.name,
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      unit: newProduct.unit,
      buyPrice: parseInt(newProduct.buyPrice),
      sellPrice: parseInt(newProduct.sellPrice),
      minStock: parseInt(newProduct.minStock)
    };
    
    updateProduct(editingProduct.id, updatedProduct);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      category: '',
      stock: '',
      unit: '',
      buyPrice: '',
      sellPrice: '',
      minStock: ''
    });
    
    alert('Produk berhasil diperbarui!');
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      category: '',
      stock: '',
      unit: '',
      buyPrice: '',
      sellPrice: '',
      minStock: ''
    });
  };

  // Quick add products - HANYA SUGGESTION, bukan auto-add
  const quickAddProducts = [
    { name: "Bayam", category: "Daun", unit: "ikat", buyPrice: "2000", sellPrice: "3000", minStock: "10" },
    { name: "Wortel", category: "Umbi", unit: "kg", buyPrice: "8000", sellPrice: "12000", minStock: "5" },
    { name: "Kol", category: "Daun", unit: "buah", buyPrice: "5000", sellPrice: "8000", minStock: "5" },
    { name: "Kentang", category: "Umbi", unit: "kg", buyPrice: "10000", sellPrice: "15000", minStock: "10" },
  ];

  const categories = [...new Set(products.map(p => p.category))];
  const units = ['kg', 'ikat', 'buah', 'bungkus', 'pack', 'karung', 'ons', 'gram'];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-responsive-2xl font-bold text-gray-800">Kelola Stok Barang</h1>
        <p className="text-gray-600 mt-1 text-responsive-sm">
          Tambah, edit, atau hapus produk dari inventaris warung
        </p>
      </div>
      
      {/* Empty State - TAMPIL JIKA BELUM ADA PRODUK */}
      {products.length === 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-dashed border-green-200 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Inventaris Masih Kosong</h3>
          <p className="text-gray-600 mb-6 text-responsive-base">
            Belum ada produk dalam inventaris. Mulai dengan menambahkan produk pertama Anda.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigateTo('dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all-responsive"
            >
              Kembali ke Dashboard
            </button>
          </div>
          
          {/* Informasi */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-yellow-800">Data akan otomatis tersimpan</p>
                <p className="text-sm text-yellow-700">
                  Semua produk yang Anda tambahkan akan otomatis tersimpan di browser Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Form Tambah/Edit Produk */}
        <div className="lg:col-span-1">
          <div className="card-responsive">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
            </div>
            
            <form onSubmit={editingProduct ? handleUpdate : handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                    Nama Produk*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: Bayam"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
                    Kategori*
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: Daun"
                    list="categories"
                    required
                  />
                  <datalist id="categories">
                    {categories.map((cat, index) => (
                      <option key={index} value={cat} />
                    ))}
                    <option value="Daun" />
                    <option value="Umbi" />
                    <option value="Buah" />
                    <option value="Sayuran" />
                    <option value="Bumbu" />
                    <option value="Lainnya" />
                  </datalist>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="stock">
                      Stok Awal*
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="unit">
                      Satuan*
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      value={newProduct.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">-- Pilih --</option>
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="buyPrice">
                      Harga Beli*
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                      <input
                        type="number"
                        id="buyPrice"
                        name="buyPrice"
                        value={newProduct.buyPrice}
                        onChange={handleChange}
                        min="1"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="2000"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="sellPrice">
                      Harga Jual*
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                      <input
                        type="number"
                        id="sellPrice"
                        name="sellPrice"
                        value={newProduct.sellPrice}
                        onChange={handleChange}
                        min="1"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="3000"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="minStock">
                    Stok Minimal*
                  </label>
                  <input
                    type="number"
                    id="minStock"
                    name="minStock"
                    value={newProduct.minStock}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="10"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                {editingProduct ? (
                  <>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                      Update Produk
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                  >
                    {products.length === 0 ? 'Tambahkan Produk Pertama' : 'Simpan Produk Baru'}
                  </button>
                )}
              </div>
            </form>
            
            {/* Quick Add Suggestions - TAMPIL JIKA showQuickAdd = true */}
            {showQuickAdd && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3">Suggestion Produk:</h4>
                <p className="text-sm text-green-700 mb-3">Klik suggestion untuk mengisi form secara otomatis:</p>
                <div className="space-y-2">
                  {quickAddProducts.map((product, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setNewProduct({
                          name: product.name,
                          category: product.category,
                          stock: "20",
                          unit: product.unit,
                          buyPrice: product.buyPrice,
                          sellPrice: product.sellPrice,
                          minStock: product.minStock
                        });
                        setShowQuickAdd(false);
                      }}
                      className="w-full text-left p-3 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-all-responsive"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{product.name}</span>
                        <span className="text-green-600 text-sm">Rp {parseInt(product.sellPrice).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{product.category} • {product.unit}</span>
                        <span>Beli: Rp {parseInt(product.buyPrice).toLocaleString('id-ID')}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-green-200">
                  <button
                    onClick={() => setShowQuickAdd(false)}
                    className="w-full text-center text-sm text-green-700 hover:text-green-900"
                  >
                    Tutup Suggestion
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Actions Panel */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">Aksi Cepat</h4>
            <div className="space-y-2">
              <button
                onClick={() => navigateTo('sales')}
                className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-all"
                disabled={products.length === 0}
                style={{ opacity: products.length === 0 ? 0.5 : 1, cursor: products.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-blue-700">Catat Penjualan</p>
                    <p className="text-xs text-blue-600">
                      {products.length === 0 ? 'Tambah produk dulu' : `${products.length} produk tersedia`}
                    </p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => navigateTo('dashboard')}
                className="w-full text-left p-3 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-all"
              >
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-700">Kembali ke Dashboard</p>
                    <p className="text-xs text-green-600">Lihat ringkasan usaha</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Daftar Produk */}
        <div className="lg:col-span-2">
          <div className="card-responsive">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Daftar Produk</h3>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  Total: <span className="font-semibold">{products.length}</span> produk
                </div>
              </div>
            </div>
            
            {products.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map(product => (
                        <tr key={product.id} className={product.stock <= product.minStock ? 'bg-red-50' : ''}>
                          <td className="px-3 py-4">
                            <div>
                              <p className="font-semibold text-sm md:text-base">{product.name}</p>
                              <p className="text-xs text-gray-500">Min: {product.minStock} {product.unit}</p>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-3 py-4">
                            <div>
                              <p className={`font-semibold ${product.stock <= product.minStock ? 'text-red-600' : 'text-gray-800'}`}>
                                {product.stock} {product.unit}
                              </p>
                              {product.stock <= product.minStock && (
                                <p className="text-xs text-red-500 mt-1">Stok hampir habis!</p>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <div>
                              <p className="text-xs text-gray-600">Beli: Rp {product.buyPrice.toLocaleString('id-ID')}</p>
                              <p className="text-sm font-semibold text-green-600">Jual: Rp {product.sellPrice.toLocaleString('id-ID')}</p>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-xs md:text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Yakin hapus ${product.name}?`)) {
                                    deleteProduct(product.id);
                                  }
                                }}
                                className="text-red-600 hover:text-red-800 font-medium text-xs md:text-sm"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Ringkasan Stok */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Ringkasan Stok</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="text-xl font-bold text-blue-600">{products.length}</p>
                      <p className="text-xs text-gray-600">Total Produk</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="text-xl font-bold text-green-600">
                        {products.reduce((sum, p) => sum + p.stock, 0)}
                      </p>
                      <p className="text-xs text-gray-600">Total Stok</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="text-xl font-bold text-yellow-600">
                        Rp {products.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0).toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-600">Nilai Stok</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="text-xl font-bold text-red-600">
                        {products.filter(p => p.stock <= p.minStock).length}
                      </p>
                      <p className="text-xs text-gray-600">Stok Rendah</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h4 className="text-lg md:text-xl font-bold text-gray-700 mb-2">Belum Ada Produk</h4>
                <p className="text-gray-600 mb-4">Mulai dengan menambahkan produk pertama Anda di form sebelah.</p>
                <div className="max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-semibold text-green-800">📝 Form Input</p>
                      <p className="text-green-700">Isi data produk lengkap</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-semibold text-blue-800">💾 Auto Save</p>
                      <p className="text-blue-700">Data otomatis tersimpan</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;