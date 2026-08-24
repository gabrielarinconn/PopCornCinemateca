import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { cn } from '@/presentation/lib/cn';

function getSearchPlaceholder(pathname: string): string {
  if (pathname.startsWith('/series')) return 'Buscar series, géneros o directores...';
  if (pathname.startsWith('/peliculas') || pathname.startsWith('/movies'))
    return 'Buscar películas...';
  if (pathname.startsWith('/mi-lista') || pathname.startsWith('/my-list'))
    return 'Buscar en Mi Lista...';
  return 'Buscar...';
}

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const searchPlaceholder = getSearchPlaceholder(location.pathname);
  const isDetailPage = location.pathname.startsWith('/pelicula/');

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {!isDetailPage && (
        <Navbar onMenuClick={toggleSidebar} searchPlaceholder={searchPlaceholder} />
      )}

      <main
        id="main-content"
        className={cn(
          isDetailPage
            ? 'min-h-screen lg:pl-sidebar-width'
            : 'pt-[var(--spacing-navbar-height)] min-h-[calc(100vh-var(--spacing-navbar-height))] lg:pl-sidebar-width lg:pr-8',
          'overflow-y-auto',
        )}
        role="main"
        tabIndex={-1}
      >
        <Outlet />
      </main>
    </div>
  );
}
