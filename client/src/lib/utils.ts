import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatter
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(date));
}

// Currency formatter
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
}

// API request wrapper with GET and POST methods
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const apiRequest = async (
  method: RequestMethod,
  url: string,
  data?: unknown
): Promise<Response> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // <-- Always included!
    ...(data && { body: JSON.stringify(data) }),
  };

  return fetch(url, options);
};

apiRequest.get = async (url: string) => {
  const res = await apiRequest('GET', url);
  return res.json(); // now always returns parsed data
};
apiRequest.post = (url: string, data: unknown) => apiRequest('POST', url, data);
