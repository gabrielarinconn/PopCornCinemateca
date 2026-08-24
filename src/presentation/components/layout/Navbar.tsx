import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Settings, Menu } from 'lucide-react';
import { cn } from '@/presentation/lib/cn';
import { useScrollDirection } from '@/presentation/hooks/use-scroll-direction';
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
  const scrollDirection = useScrollDirection();
  const navigate = useNavigate();

  const isHidden = scrollDirection === 'down' && !searchFocused;

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
        'fixed top-0 right-0 z-sticky h-[var(--spacing-navbar-height)]',
        'lg:left-[var(--spacing-sidebar-width)] lg:w-[calc(100%-var(--spacing-sidebar-width))]',
        'w-full',
        'transition-all duration-300 ease-[var(--ease-out-soft)]',
        isHidden && '-translate-y-full'
      )}
      role="banner"
    >
      <div className="h-full flex items-center justify-end px-6 gap-4 bg-background/80 backdrop-blur-md border-b border-border-subtle lg:border-b-0">
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                if (target.value.trim()) {
                  void navigate(`/buscar?q=${encodeURIComponent(target.value.trim())}`);
                  target.blur();
                }
              }
            }}
            className={cn(
              'w-[280px]',
              searchFocused && 'ring-2 ring-brand'
            )}
          />

          <IconButton icon={Bell} aria-label="Notificaciones" size="md" variant="ghost" />
          <IconButton icon={Settings} aria-label="Ajustes" size="md" variant="ghost" />
          <Avatar fallback="Usuario" size="md" />
        </div>
      </div>
    </header>
  );
}
