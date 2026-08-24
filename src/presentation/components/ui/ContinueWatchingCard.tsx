import { Play } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/presentation/lib/cn';

export interface ContinueWatchingCardProps {
  title: string;
  subtitle: string;
  progress: number;
  timeRemaining: string;
  imageUrl: string;
  size?: 'lg' | 'sm';
  href?: string;
}

export function ContinueWatchingCard({
  title,
  subtitle,
  progress,
  timeRemaining,
  imageUrl,
  size = 'lg',
  href,
}: ContinueWatchingCardProps) {
  const isLarge = size === 'lg';

  const cardContent = (
    <div className="group relative rounded-lg overflow-hidden bg-background-surface">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      >
        <button
          type="button"
          className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center shadow-elevated scale-95 group-hover:scale-100 transition-transform duration-300"
          aria-label={'Continuar viendo ' + title}
        >
          <Play className="w-6 h-6 ml-1" aria-hidden="true" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10" aria-hidden="true">
        <div
          className="h-full bg-brand transition-all duration-300"
          style={{ width: String(progress) + '%' }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={'Progreso de ' + title + ': ' + String(progress) + '%'}
        />
      </div>

      {isLarge && (
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h3 className="text-xl font-bold text-text-primary mb-1">{title}</h3>
          <p className="text-sm text-text-secondary mb-2">{subtitle}</p>
          <p className="text-xs text-text-muted">{timeRemaining}</p>
        </div>
      )}

      {!isLarge && (
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="text-sm font-medium text-text-primary mb-1 line-clamp-1">{title}</h3>
          <p className="text-xs text-text-secondary">{subtitle}</p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className={cn('block w-full aspect-video')}>
        {cardContent}
      </Link>
    );
  }

  return <div className="w-full aspect-video">{cardContent}</div>;
}
