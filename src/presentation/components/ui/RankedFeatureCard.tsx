import { Play, Plus } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

export interface RankedFeatureCardProps {
  rank: number;
  title: string;
  description?: string;
  meta?: string;
  imageUrl: string;
  badge?: string;
  rating?: number;
  watermark?: string;
  simple?: boolean;
  onPlay?: () => void;
  onAddToList?: () => void;
}

export function RankedFeatureCard({
  rank,
  title,
  description,
  meta,
  imageUrl,
  badge,
  rating,
  watermark,
  simple = false,
  onPlay,
  onAddToList,
}: RankedFeatureCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden aspect-video min-h-[400px] bg-background-surface">
      <div className="absolute inset-0">
        <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <span
          className="text-7xl font-black text-text-primary/90 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] select-none"
          aria-hidden="true"
        >
          {rank}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        <div className="flex items-center gap-3 mb-3">
          {badge && (
            <Badge variant="default" className="bg-brand text-white">
              {badge}
            </Badge>
          )}
          {rating && (
            <div className="flex items-center gap-1 text-sm font-medium text-white">
              <svg
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <h3 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2 line-clamp-1">
          {title}
        </h3>

        {meta && <p className="text-text-secondary text-sm mb-2">{meta}</p>}

        {!simple && description && (
          <p className="text-text-secondary line-clamp-2 max-w-xl mb-6">{description}</p>
        )}

        {!simple && (
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon={Play}
              onClick={onPlay}
              aria-label={`Reproducir ${title}`}
            >
              Reproducir
            </Button>
            <Button
              variant="secondary"
              icon={Plus}
              iconPosition="left"
              onClick={onAddToList}
              aria-label={`Agregar ${title} a Mi Lista`}
            >
              Mi Lista
            </Button>
          </div>
        )}
      </div>

      {watermark && (
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-5 select-none"
          aria-hidden="true"
        >
          <p className="text-6xl font-black text-text-primary tracking-tight px-8 pb-8">
            {watermark}
          </p>
        </div>
      )}
    </div>
  );
}
