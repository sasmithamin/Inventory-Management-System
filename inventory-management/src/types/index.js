// Product type
// id: auto-generated SKU (e.g., PRD-482910)
// name: product name
// category: category name
// price: number
// stock: number (must be >= 0)
// createdAt: ISO string

// StockHistory type
// id: unique log id
// productId: product SKU
// productName: product name (denormalized for display)
// type: 'increase' | 'decrease'
// amount: number changed
// previousStock: number before change
// newStock: number after change
// timestamp: ISO string
// reason: optional string

export const STORAGE_KEYS = {
  PRODUCTS: 'inv_products',
  CATEGORIES: 'inv_categories',
  HISTORY: 'inv_history',
  DARK_MODE: 'inv_dark_mode',
};