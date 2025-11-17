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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format for HTML date input
  } catch (error) {
    return '';
  }
}