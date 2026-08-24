import { Play, Star } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from './Badge';

export interface PosterCardProps {
  title: string;
  meta: string;
  imageUrl: string;
  rating?: number | undefined;
  badge?: string | undefined;
  href?: string | undefined;
}

export function PosterCard({ title, meta, imageUrl, rating, badge, href }: PosterCardProps) {
  const cardContent = (
    <div className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-background-surface">
      <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
        <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>

      {badge && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="default" className="bg-brand text-white">
            {badge}
          </Badge>
        </div>
      )}

      {rating && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/80 backdrop-blur-sm px-2 py-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
          <span className="text-xs font-medium text-white">{rating.toFixed(1)}</span>
        </div>
      )}

      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      >
        <button
          type="button"
          className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center shadow-elevated scale-95 group-hover:scale-100 transition-transform duration-300"
          aria-label={'Reproducir ' + title}
        >
          <Play className="w-6 h-6 ml-1" aria-hidden="true" />
        </button>
      </div>

      <div
        className="absolute inset-0 ring-2 ring-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />
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
      <Link to={href} className="block group" aria-label={title}>
        {cardContent}
        {metaContent}
      </Link>
    );
  }

  return (
    <div className="group">
      {cardContent}
      {metaContent}
    </div>
  );
}
