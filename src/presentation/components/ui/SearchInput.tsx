import { forwardRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/presentation/lib/cn';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = 'Search...', className, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" aria-hidden="true" />
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn(
            'w-[280px] h-10 pl-10 pr-4 rounded-full',
            'bg-background-surface/60 backdrop-blur-sm',
            'border border-transparent',
            'text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:pointer-events-none',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';