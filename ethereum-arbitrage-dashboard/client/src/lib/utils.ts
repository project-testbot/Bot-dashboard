import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string | null | undefined, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatCurrency(value: number | string, currency = 'USD'): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
}

export function formatToken(value: number | string, symbol: string, decimals = 6): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return `${numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  })} ${symbol}`;
}

export function getTimeAgo(timestamp: number | Date): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  let counter;
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    counter = Math.floor(seconds / secondsInUnit);
    if (counter > 0) {
      return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
}

export function formatEtherValue(wei: bigint, decimals = 6): string {
  const balance = parseFloat(wei.toString()) / 1e18;
  return balance.toFixed(decimals);
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
