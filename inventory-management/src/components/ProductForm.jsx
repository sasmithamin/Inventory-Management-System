import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { InputField } from './InputField';
import { Modal } from './Modal';
import { useInventory } from '../context/InventoryContext';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Product name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  category: Yup.string().required('Category is required'),
  price: Yup.number()
    .required('Price is required')
    .min(0.01, 'Price must be greater than 0')
    .typeError('Price must be a valid number'),
  stock: Yup.number()
    .required('Stock quantity is required')
    .min(0, 'Stock cannot be negative')
    .integer('Stock must be a whole number')
    .typeError('Stock must be a valid number'),
});

export const ProductForm = ({ isOpen, onClose, product = null }) => {
  const { addProduct, updateProduct, categories, addCategory } = useInventory();
  const isEditing = !!product;

  const initialValues = {
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price ?? '',
    stock: product?.stock ?? '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (isEditing) {
      updateProduct(product.id, values);
    } else {
      addProduct(values);
    }
    setSubmitting(false);
    onClose();
  };

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product' : 'Add New Product'}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <InputField name="name" label="Product Name" type="text" placeholder="Enter product name" />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <div className="flex gap-2">
                <select
                  name="category"
                  value={values.category}
                  onChange={(e) => setFieldValue('category', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(!showNewCategory)}
                  className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  + New
                </button>
              </div>
              {showNewCategory && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCategoryName.trim()) {
                        addCategory(newCategoryName.trim());
                        setFieldValue('category', newCategoryName.trim());
                        setNewCategoryName('');
                        setShowNewCategory(false);
                      }
                    }}
                    className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            <InputField name="price" label="Price ($)" type="number" step="0.01" placeholder="0.00" />
            <InputField name="stock" label="Stock Quantity" type="number" placeholder="0" />

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};