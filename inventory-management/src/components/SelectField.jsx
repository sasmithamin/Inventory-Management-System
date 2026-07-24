import { useField } from 'formik';

export const SelectField = ({ label, options, ...props }) => {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        {...field}
        {...props}
        className={`w-full px-3 py-2 rounded-md border bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-colors
          ${hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {hasError && <p className="mt-1 text-sm text-red-500">{meta.error}</p>}
    </div>
  );
};