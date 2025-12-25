/**
 * Formats a date string from backend format to a readable format
 * Backend format: "2025-12-25 13:25:24.224975"
 * @param dateString - Date string from backend
 * @returns Formatted date string or "Invalid Date" if parsing fails
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  
  try {
    // Replace space with 'T' to make it ISO compliant
    const isoString = dateString.replace(' ', 'T');
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US');
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return 'Invalid Date';
  }
}

/**
 * Formats a date string to include time
 * @param dateString - Date string from backend
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return 'N/A';
  
  try {
    // Replace space with 'T' to make it ISO compliant
    const isoString = dateString.replace(' ', 'T');
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleString('en-US');
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return 'Invalid Date';
  }
}
