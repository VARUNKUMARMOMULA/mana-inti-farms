/**
 * Formats a number as Indian Rupees (INR) currency.
 * @param amount Number to format
 * @param includeSymbol Whether to include the ₹ symbol
 */
export function formatINR(amount: number, includeSymbol = true): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  
  let formatted = formatter.format(amount);
  if (!includeSymbol) {
    formatted = formatted.replace('₹', '').trim();
  }
  return formatted;
}

/**
 * Combines class names into a single string.
 */
export function cn(...inputs: (string | undefined | null | boolean | { [key: string]: boolean })[]): string {
  const classes: string[] = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }
  
  return classes.join(' ');
}

/**
 * Generates a random order number, e.g., MIF-10284
 */
export function generateOrderNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `MIF-${num}`;
}

/**
 * Formats a date string into a readable Indian date format, e.g., 29 Jun 2026, 06:30 PM
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Global Base URL for canonical tags, sitemaps, and robots.txt
 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  'https://mana-inti-farms.vercel.app';
