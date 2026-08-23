import { cn } from '@/presentation/lib/cn';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { IconButton } from './IconButton';

export interface MiniPlayerBarProps {
  title: string;
  thumbnailUrl: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  progress?: number;
}

export function MiniPlayerBar({
  title,
  thumbnailUrl,
  isPlaying = false,
  onPlayPause,
  onPrevious,
  onNext,
  progress = 0,
}: MiniPlayerBarProps) {
  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-fixed lg:right-8 lg:left-[var(--spacing-sidebar-width)]',
        'bg-background-surface/90 backdrop-blur-md border border-border-subtle rounded-lg shadow-elevated',
        'p-3 md:p-4'
      )}
      role="region"
      aria-label="Mini reproductor"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand" aria-hidden="true">
        <div
          className="h-full bg-brand transition-all duration-100"
          style={{ width: String(progress) + '%' }}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={thumbnailUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted uppercase tracking-wide">Ahora suena</p>
          <p className="text-sm font-medium text-brand truncate">{title}</p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <IconButton
            icon={SkipBack}
            aria-label="Anterior"
            size="sm"
            variant="ghost"
            onClick={onPrevious}
          />
          <button
            type="button"
            onClick={onPlayPause}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand text-white flex items-center justify-center transition-colors duration-200 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Play className="w-5 h-5 ml-1" aria-hidden="true" />
            )}
          </button>
          <IconButton
            icon={SkipForward}
            aria-label="Siguiente"
            size="sm"
            variant="ghost"
            onClick={onNext}
          />
        </div>
      </div>
    </div>
  );
}