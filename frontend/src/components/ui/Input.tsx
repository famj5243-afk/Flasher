import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label text-sm font-medium mb-1 block">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'input w-full px-3 py-2 border rounded',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'bg-[rgb(var(--surface))] text-[rgb(var(--text-primary))]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
