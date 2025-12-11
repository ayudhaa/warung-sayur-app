import React from 'react';

const FinancialReport = ({ sales, purchases, products, navigateTo }) => {
  // Calculate financial data
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);
  const grossProfit = totalSales - totalPurchases;
  
  // Additional expenses (simulated)
  const additionalExpenses = sales.length > 0 ? 500000 : 0; // Hanya ada biaya jika ada penjualan
  const netProfit = grossProfit - additionalExpenses;
  
  // Calculate inventory value
  const inventoryValue = products.reduce((sum, product) => sum + (product.stock * product.buyPrice), 0);
  
  // Sales by product
  const salesByProduct = {};
  sales.forEach(sale => {
    if (!salesByProduct[sale.productName]) {
      salesByProduct[sale.productName] = { quantity: 0, total: 0 };
    }
    salesByProduct[sale.productName].quantity += sale.quantity;
    salesByProduct[sale.productName].total += sale.totalPrice;
  });

  const hasSalesData = sales.length > 0;
  const hasProductsData = products.length > 0;

    return (
        <div className="animate-fade-in">
            <h2 className="text-responsive-2xl font-bold text-gray-800 mb-6">Laporan Keuangan</h2>
            
            {/* Empty State - Jika belum ada penjualan */}
            {!hasSalesData && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 text-center">
                    {/* ... kode sebelumnya ... */}
                    <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => navigateTo('sales')}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Mulai Penjualan
                    </button>
                    {!hasProductsData && (
                        <button
                        onClick={() => navigateTo('inventory')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                        >
                        Tambah Produk Dulu
                        </button>
                    )}
                    </div>
                </div>
            )}
            
            {/* Tampilkan laporan hanya jika ada data penjualan */}
            {hasSalesData && (
            <>
                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Cards untuk laporan keuangan */}
                </div>
                
                {/* Rest of financial report */}
            </>
            )}
        </div>
    );
};

export default FinancialReport;