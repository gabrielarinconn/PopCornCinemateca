import { Film } from 'lucide-react';
import { Link } from 'react-router';

export interface EmptyPosterCardProps {
  title: string;
  meta: string;
  href?: string;
}

export function EmptyPosterCard({ title, meta, href }: EmptyPosterCardProps) {
  const cardContent = (
    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-background-surface flex items-center justify-center">
      <Film className="w-12 h-12 text-text-muted" aria-hidden="true" />
    </div>
  );

  const metaContent = (
    <div className="mt-3 space-y-1">
      <h3 className="text-sm font-medium text-text-primary line-clamp-1">{title}</h3>
      <p className="text-xs text-text-secondary">{meta}</p>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block">
        {cardContent}
        {metaContent}
      </Link>
    );
  }

  return (
    <div>
      {cardContent}
      {metaContent}
    </div>
  );
}