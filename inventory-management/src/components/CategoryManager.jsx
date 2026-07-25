import { useState } from 'react';
import { FolderPlus, Trash2, AlertTriangle, Package } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { ConfirmDialog } from './ConfirmDialog';

export const CategoryManager = () => {
  const { categories, products, addCategory, deleteCategory } = useInventory();
  const [newName, setNewName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, name: '' });

  const getProductCount = (catName) => products.filter((p) => p.category === catName).length;

  const handleAdd = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      const added = addCategory(newName.trim());
      if (added) setNewName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Category</h3>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <FolderPlus size={18} /> Add Category
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = getProductCount(cat);
          return (
            <div
              key={cat}
              className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{cat}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <Package size={14} /> {count} product{count !== 1 ? 's' : ''}
                </p>
              </div>
              {cat !== 'Other' && (
                <button
                  onClick={() => setDeleteConfirm({ open: true, name: cat })}
                  className="p-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete category"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, name: '' })}
        onConfirm={() => {
          deleteCategory(deleteConfirm.name);
        }}
        title="Delete Category"
        message={`Deleting "${deleteConfirm.name}" will move its products to "Other". Are you sure?`}
      />
    </div>
  );
};