import { cn, getStatusColor, getCategoryColor } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'status' | 'category';
  status?: string;
  category?: string;
  className?: string;
}

export function Badge({ children, variant = 'default', status, category, className }: BadgeProps) {
  let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';

  if (variant === 'status' && status) {
    colorClass = getStatusColor(status);
  } else if (variant === 'category' && category) {
    colorClass = getCategoryColor(category);
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorClass,
      className
    )}>
      {children}
    </span>
  );
}
