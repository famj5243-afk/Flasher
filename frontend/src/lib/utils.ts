import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    QUEUED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    SENT: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    DELIVERED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    BOUNCED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    CRYPTO_EDUCATION: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    ECOMMERCE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    BANKING: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    LOGISTICS: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    CUSTOM: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  };
  return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    CRYPTO_EDUCATION: 'Crypto Education',
    ECOMMERCE: 'E-commerce',
    BANKING: 'Banking',
    LOGISTICS: 'Logistics',
    CUSTOM: 'Custom',
  };
  return labels[category] || category;
}
