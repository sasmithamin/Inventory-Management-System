export const generateSKU = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `PRD-${random}`;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleString();
};