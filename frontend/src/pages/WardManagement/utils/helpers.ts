export const formatAge = (dobISO?: string): string => {
  if (!dobISO) return "–";
  const dob = new Date(dobISO);
  if (Number.isNaN(dob.getTime())) return "–";
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return `${age}`;
};

export const cleanPhn = (phn: string): string => {
  return phn.replace(/[^0-9]/g, "");
};

export const calculateBMI = (heightCm: number, weightKg: number): number => {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};