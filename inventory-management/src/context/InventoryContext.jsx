import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getProducts, setProducts, getCategories, setCategories, getHistory, setHistory } from '../utils/storage';
import { generateSKU } from '../utils/helpers';

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const [products, setProductsState] = useState(() => getProducts());
  const [categories, setCategoriesState] = useState(() => getCategories());
  const [history, setHistoryState] = useState(() => getHistory());

  // Sync to localStorage whenever state changes
  useEffect(() => setProducts(products), [products]);
  useEffect(() => setCategories(categories), [categories]);
  useEffect(() => setHistory(history), [history]);

  const addProduct = useCallback((productData) => {
    const newProduct = {
      ...productData,
      id: generateSKU(),
      createdAt: new Date().toISOString(),
    };
    setProductsState((prev) => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProductsState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProductsState((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const deleteMultipleProducts = useCallback((ids) => {
    setProductsState((prev) => prev.filter((p) => !ids.includes(p.id)));
  }, []);

  const adjustStock = useCallback((id, amount, reason = '') => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const previousStock = product.stock;
    const newStock = Math.max(0, previousStock + amount);

    const logEntry = {
      id: crypto.randomUUID(),
      productId: id,
      productName: product.name,
      type: amount >= 0 ? 'increase' : 'decrease',
      amount: Math.abs(amount),
      previousStock,
      newStock,
      timestamp: new Date().toISOString(),
      reason,
    };

    setHistoryState((h) => [logEntry, ...h]);
    setProductsState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
  }, [products]);

  const addCategory = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    setCategoriesState((prev) => {
      if (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return prev;
      return [...prev, trimmed];
    });
    return true;
  }, []);

  const deleteCategory = useCallback((name) => {
    setCategoriesState((prev) => prev.filter((c) => c !== name));
    // Remove category from products or set to 'Other'
    setProductsState((prev) =>
      prev.map((p) => (p.category === name ? { ...p, category: 'Other' } : p))
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryState([]);
  }, []);

  const value = {
    products,
    categories,
    history,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts,
    adjustStock,
    addCategory,
    deleteCategory,
    clearHistory,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be inside InventoryProvider');
  return ctx;
};