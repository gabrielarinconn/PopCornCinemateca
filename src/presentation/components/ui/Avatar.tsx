import { forwardRef } from 'react';
import { cn } from '@/presentation/lib/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, size = 'md', className, ...props }, ref) => {
    const initials = fallback
      ? fallback
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : '?';

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden',
          'bg-background-surface border border-border-subtle',
          'ring-1 ring-inset ring-border-subtle',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt ?? ''} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="font-medium text-text-primary" aria-hidden="true">
            {initials}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
