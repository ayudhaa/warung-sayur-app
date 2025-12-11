import { useState, useEffect } from 'react';
import { getInitialProducts, getInitialSales, getInitialPurchases } from '../data';

const useDataStore = () => {
  // Load data from localStorage on initial render
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue();
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue();
    }
  };

  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // State untuk data - SEMUA KOSONG
  const [products, setProductsState] = useState(() => 
    loadFromLocalStorage('warung_sayur_products', getInitialProducts)
  );
  
  const [sales, setSalesState] = useState(() => 
    loadFromLocalStorage('warung_sayur_sales', getInitialSales)
  );
  
  const [purchases, setPurchasesState] = useState(() => 
    loadFromLocalStorage('warung_sayur_purchases', getInitialPurchases)
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage('warung_sayur_products', products);
  }, [products]);

  useEffect(() => {
    saveToLocalStorage('warung_sayur_sales', sales);
  }, [sales]);

  useEffect(() => {
    saveToLocalStorage('warung_sayur_purchases', purchases);
  }, [purchases]);

  // CRUD Operations for Products
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'admin'
    };
    setProductsState([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updatedProduct) => {
    const updatedProducts = products.map(product => 
      product.id === id 
        ? { 
            ...updatedProduct, 
            id, 
            lastUpdated: new Date().toISOString().split('T')[0],
            updatedBy: 'admin'
          }
        : product
    );
    setProductsState(updatedProducts);
    return updatedProducts.find(p => p.id === id);
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProductsState(updatedProducts);
    return updatedProducts;
  };

  const clearAllProducts = () => {
    setProductsState([]);
    localStorage.removeItem('warung_sayur_products');
  };

  // CRUD Operations for Sales - INI YANG PENTING
  const addSale = (sale) => {
    const newSale = {
      ...sale,
      id: sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1
    };
    setSalesState([...sales, newSale]);
    return newSale;
  };

  const deleteSale = (id) => {
    const updatedSales = sales.filter(sale => sale.id !== id);
    setSalesState(updatedSales);
    return updatedSales;
  };

  const clearAllSales = () => {
    setSalesState([]);
    localStorage.removeItem('warung_sayur_sales');
  };

  // CRUD Operations for Purchases
  const addPurchase = (purchase) => {
    const newPurchase = {
      ...purchase,
      id: purchases.length > 0 ? Math.max(...purchases.map(p => p.id)) + 1 : 1
    };
    setPurchasesState([...purchases, newPurchase]);
    return newPurchase;
  };

  const deletePurchase = (id) => {
    const updatedPurchases = purchases.filter(purchase => purchase.id !== id);
    setPurchasesState(updatedPurchases);
    return updatedPurchases;
  };

  const clearAllPurchases = () => {
    setPurchasesState([]);
    localStorage.removeItem('warung_sayur_purchases');
  };

  // Clear ALL data
  const clearAllData = () => {
    setProductsState([]);
    setSalesState([]);
    setPurchasesState([]);
    localStorage.removeItem('warung_sayur_products');
    localStorage.removeItem('warung_sayur_sales');
    localStorage.removeItem('warung_sayur_purchases');
  };

  // Reset ALL data to initial (empty)
  const resetAllData = () => {
    setProductsState(getInitialProducts());
    setSalesState(getInitialSales());
    setPurchasesState(getInitialPurchases());
  };

  return {
    // Data - SEMUA KOSONG DI AWAL
    products,
    sales,
    purchases,
    
    // Setter functions
    setProducts: setProductsState,
    setSales: setSalesState,
    setPurchases: setPurchasesState,
    
    // Product operations
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    
    // Sale operations
    addSale,
    deleteSale,
    clearAllSales,
    
    // Purchase operations
    addPurchase,
    deletePurchase,
    clearAllPurchases,
    
    // Global operations
    clearAllData,
    resetAllData,
    
    // Statistics
    getStatistics: () => ({
      totalProducts: products.length,
      totalSales: sales.reduce((sum, sale) => sum + sale.totalPrice, 0),
      totalPurchases: purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0),
      profit: sales.reduce((sum, sale) => sum + sale.totalPrice, 0) - 
              purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0),
      lowStockProducts: products.filter(p => p.stock <= p.minStock).length,
      totalSalesTransactions: sales.length,
      totalPurchaseTransactions: purchases.length,
      isEmpty: products.length === 0 && sales.length === 0 && purchases.length === 0,
      hasSales: sales.length > 0,
      hasProducts: products.length > 0,
      hasPurchases: purchases.length > 0
    })
  };
};

export default useDataStore;