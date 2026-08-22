import { cn } from '@/presentation/lib/cn';

export interface FilterPillGroupProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}

export function FilterPillGroup({ options, active, onChange }: FilterPillGroupProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros de género">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => {
            onChange(option);
          }}
          className={cn(
            'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            active === option
              ? 'bg-brand text-white shadow-[0_4px_14px_rgba(139,92,246,0.4)]'
              : 'bg-background-surface text-text-secondary hover:bg-background-surface hover:text-text-primary hover:border-border-subtle border border-transparent'
          )}
          aria-pressed={active === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}