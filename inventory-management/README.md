---------------Project overview--------------

Project structure as below,

src/
├── components/
│   ├── Layout.jsx
│   ├── Dashboard.jsx
│   ├── ProductList.jsx
│   ├── ProductForm.jsx
│   ├── StockAdjustmentModal.jsx
│   ├── StockHistory.jsx
│   ├── CategoryManager.jsx
│   ├── Modal.jsx
│   ├── ConfirmDialog.jsx
│   ├── InputField.jsx
│   ├── SelectField.jsx
│   └── EmptyState.jsx
├── context/
│   ├── ThemeContext.jsx
│   └── InventoryContext.jsx
├── utils/
│   ├── storage.js
│   └── helpers.js
├── types/
│   └── index.js
├── App.jsx
├── main.jsx
└── index.css

-------------------Tech Stack---------------------

React 18 + Vite
Formik + Yup - form handling and validation
Tailwind CSS - styling
Recharts - analytics charts
Lucide React - icons
localStorage - data persistence


------------------How to run the project locally--------------

Follow below steps,

1. Clone the repository

git clone 
cd inventory-management

Install dependencies

npm install

Start the dev server

npm run dev

Open your browser

Navigate to http://localhost:5173


------------------------List of features implemented----------------------

Core Features,

Product Management - Add, edit, delete products with auto-generated SKU (e.g., PRD-482910)
Stock Management - Increase (restock) and decrease (sales) stock with validation to prevent negative values
Dashboard - View total products, total inventory value, out-of-stock count and low-stock alerts
Category Handling - Create custom categories, assign to products, filter by category, view product count per category
Search & Filter - Search by product name or SKU, filter by category, filter by stock status (In Stock / Out of Stock)
Responsive UI - Works on mobile and desktop with clean layout

Bonus Features Mentioned,

Auto-generated SKU - Unique Product ID generated automatically
Stock History Log - Every stock change recorded with timestamp, reason, before/after values
Export to CSV - Download full product list as .csv
Dark Mode - Toggle between light/dark themes, preference saved in localStorage
Analytics Chart - Bar chart of products by category + Pie chart of stock status distribution
Bulk Actions - Select multiple products to delete or restock (+10) at once

