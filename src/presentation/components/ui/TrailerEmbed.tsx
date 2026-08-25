interface TrailerEmbedProps {
  videoKey: string;
  title: string;
}

export function TrailerEmbed({ videoKey, title }: TrailerEmbedProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-background-surface">
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}`}
          title={`Tráiler de ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}
