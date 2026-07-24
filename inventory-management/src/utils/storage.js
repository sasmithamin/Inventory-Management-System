import { STORAGE_KEYS } from '../types';

const safeParse = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage error:', e);
  }
};

export const getProducts = () => safeParse(STORAGE_KEYS.PRODUCTS, []);
export const setProducts = (products) => safeSet(STORAGE_KEYS.PRODUCTS, products);

export const getCategories = () => safeParse(STORAGE_KEYS.CATEGORIES, ['Electronics', 'Clothing', 'Food', 'Books', 'Other']);
export const setCategories = (categories) => safeSet(STORAGE_KEYS.CATEGORIES, categories);

export const getHistory = () => safeParse(STORAGE_KEYS.HISTORY, []);
export const setHistory = (history) => safeSet(STORAGE_KEYS.HISTORY, history);

export const getDarkMode = () => safeParse(STORAGE_KEYS.DARK_MODE, false);
export const setDarkMode = (isDark) => safeSet(STORAGE_KEYS.DARK_MODE, isDark);