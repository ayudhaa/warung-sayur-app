// src/data.js

// SEMUA DATA AWAL KOSONG - Tidak ada contoh data sama sekali
export const getInitialProducts = () => {
  return []; // Array kosong
};

export const getInitialSales = () => {
  return []; // Array kosong - tidak ada riwayat penjualan
};

export const getInitialPurchases = () => {
  return []; // Array kosong
};

export const userRoles = {
  admin: {
    name: "Administrator",
    permissions: ["dashboard", "sales", "purchase", "inventory", "report", "data-management", "header"]
  },
  kasir: {
    name: "Kasir",
    permissions: ["dashboard", "sales", "inventory", "header"]
  }
};