import { Package } from 'lucide-react';

export const EmptyState = ({ message = 'No items found' }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
    <Package size={48} className="mb-3 opacity-50" />
    <p className="text-lg">{message}</p>
  </div>
);