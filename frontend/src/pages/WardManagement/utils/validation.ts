export const validatePhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

export const validateNIC = (nic: string): boolean => {
  return nic.length === 10;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateNumeric = (value: string): boolean => {
  if (!value) return true;
  return !isNaN(Number(value));
};