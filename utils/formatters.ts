export const formatCurrency = (amount: number): string => {
  return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const parseAmount = (amountString: string): number => {
  // Remove currency symbols and commas
  const cleanedString = amountString.replace(/[$,]/g, '');
  return parseFloat(cleanedString);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};