import { useState, useMemo } from 'react';
import { Search, Filter, Trash2, Edit, Plus, Minus, Download, Package } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { formatCurrency } from '../utils/helpers';
import { ProductForm } from './ProductForm';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { ConfirmDialog } from './ConfirmDialog';
import { EmptyState } from './EmptyState';

export const ProductList = () => {
  const { products, categories, deleteProduct, deleteMultipleProducts, adjustStock } = useInventory();
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState(''); // 'in-stock' | 'out-of-stock'
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [adjustModal, setAdjustModal] = useState({ open: false, product: null, type: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, ids: [] });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      const matchesStock =
        !stockFilter ||
        (stockFilter === 'in-stock' ? p.stock > 0 : p.stock === 0);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setDeleteConfirm({ open: true, ids: selectedIds });
    }
  };

  const handleBulkRestock = () => {
    selectedIds.forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product) {
        adjustStock(id, 10, 'Bulk restock');
      }
    });
    setSelectedIds([]);
  };

  const exportCSV = () => {
    const headers = ['Product ID', 'Name', 'Category', 'Price', 'Stock', 'Created At'];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.price,
      p.stock,
      p.createdAt,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
          >
            <option value="">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={handleBulkRestock}
                className="px-3 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 flex items-center gap-1"
              >
                <Plus size={16} /> Bulk Restock (+10)
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete ({selectedIds.length})
              </button>
            </>
          )}
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormOpen(true);
            }}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredProducts.length === 0 ? (
        <EmptyState message="No products match your filters" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3">Product ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{product.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    {product.stock > 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setAdjustModal({ open: true, product, type: 'increase' });
                        }}
                        className="p-1.5 rounded-md text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                        title="Restock"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (product.stock > 0) {
                            setAdjustModal({ open: true, product, type: 'decrease' });
                          }
                        }}
                        className={`p-1.5 rounded-md ${product.stock > 0 ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20' : 'text-gray-300 cursor-not-allowed'}`}
                        title="Sell"
                        disabled={product.stock === 0}
                      >
                        <Minus size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setFormOpen(true);
                        }}
                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ open: true, ids: [product.id] })}
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        product={editingProduct}
      />

      {adjustModal.open && (
        <StockAdjustmentModal
          isOpen={adjustModal.open}
          onClose={() => setAdjustModal({ open: false, product: null, type: '' })}
          product={adjustModal.product}
          type={adjustModal.type}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, ids: [] })}
        onConfirm={() => {
          deleteMultipleProducts(deleteConfirm.ids);
          setSelectedIds((prev) => prev.filter((id) => !deleteConfirm.ids.includes(id)));
        }}
        title="Delete Product"
        message={`Are you sure you want to delete ${deleteConfirm.ids.length > 1 ? 'these products' : 'this product'}? This action cannot be undone.`}
      />
    </div>
  );
};