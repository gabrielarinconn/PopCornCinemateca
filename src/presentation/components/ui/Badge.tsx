import { cn } from '@/presentation/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase',
        'transition-colors duration-200',
        variant === 'default' && 'bg-white/[0.08] text-text-secondary',
        variant === 'outline' && 'border border-border-subtle bg-transparent text-text-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
