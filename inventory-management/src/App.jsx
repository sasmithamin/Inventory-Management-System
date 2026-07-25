import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { InventoryProvider } from './context/InventoryContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProductList } from './components/ProductList';
import { StockHistory } from './components/StockHistory';
import { CategoryManager } from './components/CategoryManager';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductList />;
      case 'history':
        return <StockHistory />;
      case 'categories':
        return <CategoryManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <InventoryProvider>
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </Layout>
      </InventoryProvider>
    </ThemeProvider>
  );
}

export default App;