import { Link } from 'react-router';
import type { LucideIcon } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  href?: string;
  linkLabel?: string;
  icon?: LucideIcon;
  accentBar?: boolean;
}

export function SectionHeader({
  title,
  href,
  linkLabel = 'Ver Todo',
  icon: Icon,
  accentBar,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {accentBar && <div className="w-1 h-8 bg-brand rounded-full" aria-hidden="true" />}
        {Icon && <Icon className="w-5 h-5 text-brand" aria-hidden="true" />}
        <h2 className="text-xl font-bold text-text-lavender tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link
          to={href}
          className="text-sm font-medium text-brand hover:text-brand-hover transition-colors duration-200 flex items-center gap-1"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
