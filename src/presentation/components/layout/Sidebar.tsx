import { NavLink, useLocation } from 'react-router';
import { X, Compass, Film, Tv, Bookmark } from 'lucide-react';
import { cn } from '@/presentation/lib/cn';
import { NavItem } from '../ui/NavItem';

interface NavConfigItem {
  icon: React.ElementType;
  label: string;
  to: string;
}

const NAV_ITEMS: NavConfigItem[] = [
  { icon: Compass, label: 'Explorar', to: '/explore' },
  { icon: Tv, label: 'Series', to: '/series' },
  { icon: Film, label: 'Películas', to: '/movies' },
  { icon: Bookmark, label: 'Mi Lista', to: '/my-list' },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className={cn(
            'fixed top-4 left-4 z-fixed w-10 h-10 rounded-lg',
            'bg-background border border-border-subtle',
            'text-text-secondary hover:text-text-primary',
            'transition-colors duration-200',
            'lg:hidden',
          )}
          onClick={() => {
            onClose();
          }}
          aria-label="Cerrar menú lateral"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-sticky w-sidebar-width',
          'bg-background border-r border-border-subtle',
          'flex flex-col',
          'transform transition-transform duration-300 ease-out-soft lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Navegación principal"
        role="navigation"
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-start px-6 py-8">
            <NavLink to="/" className="flex items-center gap-2" aria-label="popCorn - Inicio">
              <span className="text-2xl font-extrabold tracking-tight text-text-primary">
                popCorn
              </span>
            </NavLink>
            <p className="mt-1 text-xs text-text-muted font-medium">Premium Streaming</p>
          </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto" aria-label="Menú principal">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavItem
                    icon={item.icon}
                    label={item.label}
                    to={item.to}
                    isActive={location.pathname === item.to}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto px-4 pb-6">
            {/* Placeholder para futura sección de perfil/ajustes/logout */}
            {/* <div className="px-3 py-2.5 text-xs text-text-muted">Cuenta y ajustes</div> */}
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-[299] bg-scrim/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
