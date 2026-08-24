import { useState, useRef, useEffect } from 'react';
import { Bell, Settings, Menu } from 'lucide-react';
import { cn } from '@/presentation/lib/cn';
import { IconButton } from '../ui/IconButton';
import { SearchInput } from '../ui/SearchInput';
import { Avatar } from '../ui/Avatar';

export function Navbar({
  onMenuClick,
  searchPlaceholder = 'Search...',
}: {
  onMenuClick: () => void;
  searchPlaceholder?: string;
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-sticky h-navbar-height',
        'lg:left-sidebar-width lg:w-[calc(100%-var(--spacing-sidebar-width))]',
        'w-[calc(100%-0px)]',
        'transition-all duration-300 ease-out-soft',
      )}
      role="banner"
    >
      <div className="h-full flex items-center justify-end px-6 gap-4">
        <div className="flex items-center gap-4 lg:hidden">
          <button
            type="button"
            className="w-10 h-10 rounded-lg text-text-secondary hover:text-text-primary transition-colors duration-200"
            onClick={onMenuClick}
            aria-label="Abrir menú lateral"
            aria-expanded="false"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-4" ref={searchRef}>
          <SearchInput
            placeholder={searchPlaceholder}
            onFocus={() => {
              setSearchFocused(true);
            }}
            onBlur={() => {
              setSearchFocused(false);
            }}
            className={cn('w-[280px]', searchFocused && 'ring-2 ring-brand')}
          />

          <IconButton icon={Bell} aria-label="Notificaciones" size="md" variant="ghost" />
          <IconButton icon={Settings} aria-label="Ajustes" size="md" variant="ghost" />
          <Avatar fallback="Usuario" size="md" />
        </div>
      </div>
    </header>
  );
}
