import { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/presentation/lib/cn';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost';
  'aria-label': string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const variantClasses = {
  default: 'bg-background-surface/50 border border-border-subtle hover:bg-background-surface transition-colors duration-200',
  ghost: 'bg-transparent border-none hover:bg-white/[0.06] transition-colors duration-200',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, size = 'md', variant = 'default', className, 'aria-label': ariaLabel, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          'text-text-secondary hover:text-text-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:pointer-events-none',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        aria-label={ariaLabel}
        {...props}
      >
        <Icon className={cn(iconSizeClasses[size], 'flex-shrink-0')} aria-hidden="true" />
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';