export function formatDateDisplay(dateString: string): string {
  if (!dateString) return '';
  
  try {
    return formatDateToDDMMYYYY(dateString);
  } catch (error) {
    return dateString;
  }
}

export function formatDateTimeDisplay(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const datePart = formatDateToDDMMYYYY(dateString);
    const date = new Date(dateString);
    const timePart = isNaN(date.getTime()) ? '' : date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return timePart ? `${datePart} ${timePart}` : datePart;
  } catch (error) {
    return dateString;
  }
}

export function formatTimeDisplay(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return dateString;
  }
}

export function formatDateToDDMMYYYY(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    let y: number, m: number, d: number;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const parts = dateString.split('-');
      y = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10);
      d = parseInt(parts[2], 10);
    } else {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      y = date.getFullYear();
      m = date.getMonth() + 1;
      d = date.getDate();
    }
    const day = d.toString().padStart(2, '0');
    const month = m.toString().padStart(2, '0');
    return `${day}/${month}/${y}`;
  } catch {
    return '';
  }
}

export function parseDDMMYYYYToISO(dateString: string): string {
  if (!dateString) return '';
  
  try {
    // Parse DD/MM/YYYY format
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  } catch (error) {
    return '';
  }
}

export function formatDateToInputValue(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return toLocalISO(date);
  } catch { return ''; }
}

/**
 * Safely convert ISO date string (YYYY-MM-DD) to Date object without timezone offset.
 * This prevents the calendar picker from selecting the previous day due to timezone conversion.
 * Returns a Date object set to noon UTC to ensure consistent date representation across timezones.
 */
export function isoStringToDate(isoString: string): Date | undefined {
  if (!isoString) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoString)) return undefined;
  const [y, m, d] = isoString.split('-').map(Number);
  if ([y, m, d].some(isNaN)) return undefined;
  return new Date(y, m - 1, d);
}

export function toLocalISO(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}