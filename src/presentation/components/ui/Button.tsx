import { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/presentation/lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const variantClasses = {
  primary: 'bg-brand text-white hover:bg-brand-hover transition-colors duration-200',
  secondary: 'bg-white/[0.08] text-white hover:bg-white/[0.12] transition-colors duration-200',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      icon: Icon,
      iconPosition = 'left',
      size = 'md',
      isLoading,
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled ?? isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:pointer-events-none',
          'active:scale-[0.98] transition-transform duration-100',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : Icon && iconPosition === 'left' ? (
          <Icon className={cn(iconSizeClasses[size], 'flex-shrink-0')} aria-hidden="true" />
        ) : null}
        {children}
        {Icon && iconPosition === 'right' && !isLoading && (
          <Icon className={cn(iconSizeClasses[size], 'flex-shrink-0')} aria-hidden="true" />
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
