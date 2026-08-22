import { NavLink } from 'react-router';
import { cn } from '@/presentation/lib/cn';

export interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive?: boolean;
}

export function NavItem({ icon: Icon, label, to, isActive }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive: active }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg w-full',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          active
            ? 'bg-brand-subtle text-text-primary'
            : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
        )
      }
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon
        className={cn(
          'w-5 h-5 flex-shrink-0',
          'transition-colors duration-200',
          isActive ? 'text-brand' : 'text-text-secondary'
        )}
        aria-hidden="true"
      />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}