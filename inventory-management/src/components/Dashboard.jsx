import { useMemo } from 'react';
import { Package, DollarSign, Layers, AlertTriangle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { formatCurrency } from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export const Dashboard = () => {
  const { products, categories } = useInventory();

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

    const categoryData = categories.map((cat) => ({
      name: cat,
      count: products.filter((p) => p.category === cat).length,
      value: products
        .filter((p) => p.category === cat)
        .reduce((sum, p) => sum + p.price * p.stock, 0),
    })).filter((c) => c.count > 0);

    return { totalProducts, totalValue, outOfStock, lowStock, categoryData };
  }, [products, categories]);

  const stockDistribution = useMemo(() => {
    return [
      { name: 'In Stock', value: products.filter((p) => p.stock > 5).length },
      { name: 'Low Stock', value: products.filter((p) => p.stock > 0 && p.stock <= 5).length },
      { name: 'Out of Stock', value: products.filter((p) => p.stock === 0).length },
    ].filter((d) => d.value > 0);
  }, [products]);

  const StatCard = ({ icon: Icon, label, value, iconColor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">{value}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/80">
          <Icon size={20} className={iconColor} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          iconColor="text-blue-500 dark:text-blue-400"
        />
        <StatCard
          icon={DollarSign}
          label="Inventory Value"
          value={formatCurrency(stats.totalValue)}
          iconColor="text-emerald-500 dark:text-emerald-400"
        />
        <StatCard
          icon={AlertTriangle}
          label="Out of Stock"
          value={stats.outOfStock}
          iconColor="text-red-500 dark:text-red-400"
        />
        <StatCard
          icon={Layers}
          label="Low Stock (≤5)"
          value={stats.lowStock}
          iconColor="text-amber-500 dark:text-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
            Products by Category
          </h3>
          {stats.categoryData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#09090b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f4f4f5',
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Stock Status Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
            Stock Status Distribution
          </h3>
          {stockDistribution.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stockDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#09090b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f4f4f5',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Category Summary Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Category Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Product Count</th>
                <th className="px-6 py-3 font-semibold">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-250 dark:divide-gray-700">
              {stats.categoryData.map((cat) => (
                <tr key={cat.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-gray-900 dark:text-white">{cat.name}</td>
                  <td className="px-6 py-3.5">{cat.count}</td>
                  <td className="px-6 py-3.5 font-mono">{formatCurrency(cat.value)}</td>
                </tr>
              ))}
              {stats.categoryData.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No categories with products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};