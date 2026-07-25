import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Modal } from './Modal';
import { InputField } from './InputField';
import { useInventory } from '../context/InventoryContext';

const validationSchema = Yup.object({
  amount: Yup.number()
    .required('Amount is required')
    .min(1, 'Amount must be at least 1')
    .integer('Amount must be a whole number')
    .typeError('Amount must be a valid number'),
  reason: Yup.string().max(200, 'Reason must be less than 200 characters'),
});

export const StockAdjustmentModal = ({ isOpen, onClose, product, type }) => {
  const { adjustStock } = useInventory();
  const isIncrease = type === 'increase';

  const handleSubmit = (values, { setSubmitting }) => {
    const amount = isIncrease ? Number(values.amount) : -Number(values.amount);
    adjustStock(product.id, amount, values.reason);
    setSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isIncrease ? 'Restock' : 'Sell'} — ${product?.name}`}
      maxWidth="max-w-md"
    >
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Current stock: <span className="font-semibold text-gray-900 dark:text-white">{product?.stock ?? 0}</span>
      </div>
      <Formik
        initialValues={{ amount: '', reason: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="amount"
              label={`Quantity to ${isIncrease ? 'add' : 'remove'}`}
              type="number"
              min="1"
              placeholder="Enter quantity"
            />
            <InputField
              name="reason"
              label="Reason (optional)"
              type="text"
              placeholder="e.g., New shipment, Customer order #123"
            />
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
                className={`px-4 py-2 rounded-md text-white disabled:opacity-50 ${
                  isIncrease ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isIncrease ? 'Restock' : 'Confirm Sale'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};