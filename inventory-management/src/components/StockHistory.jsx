import { useState } from 'react';
import { History, Trash2, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { formatDate, formatCurrency } from '../utils/helpers';
import { ConfirmDialog } from './ConfirmDialog';

export const StockHistory = () => {
  const { history, clearHistory } = useInventory();
  const [search, setSearch] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = history.filter(
    (h) =>
      h.productName.toLowerCase().includes(search.toLowerCase()) ||
      h.productId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
          />
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 rounded-md border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
          >
            <Trash2 size={16} /> Clear History
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <History size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-lg">No stock history found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Previous</th>
                <th className="px-4 py-3">New</th>
                <th className="px-4 py-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{log.productName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{log.productId}</td>
                  <td className="px-4 py-3">
                    {log.type === 'increase' ? (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                        <ArrowUpRight size={14} /> Restock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400">
                        <ArrowDownRight size={14} /> Sale
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold">{log.amount}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{log.previousStock}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{log.newStock}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                    {log.reason || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearHistory}
        title="Clear History"
        message="Are you sure you want to clear all stock history? This cannot be undone."
      />
    </div>
  );
};