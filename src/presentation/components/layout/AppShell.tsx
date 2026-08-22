import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { siteCopy } from '@/presentation/copy/site';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { cn } from '@/presentation/lib/cn';

function getSearchPlaceholder(pathname: string): string {
  if (pathname.startsWith('/series')) return 'Buscar series, géneros o directores...';
  if (pathname.startsWith('/peliculas') || pathname.startsWith('/movies')) return 'Buscar películas...';
  if (pathname.startsWith('/mi-lista') || pathname.startsWith('/my-list')) return 'Buscar en Mi Lista...';
  return 'Buscar...';
}

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const searchPlaceholder = getSearchPlaceholder(location.pathname);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <Navbar onMenuClick={toggleSidebar} searchPlaceholder={searchPlaceholder} />

      <main
        id="main-content"
        className={cn(
          'pt-navbar-height min-h-[calc(100vh-4.5rem)]',
          'lg:pl-sidebar-width lg:pr-8 lg:pt-8',
          'overflow-y-auto'
        )}
        role="main"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 lg:left-sidebar-width z-sticky border-t border-border-subtle bg-background-elevated/80 backdrop-blur-sm">
        <p className="px-4 py-3 lg:px-8 text-xs text-text-muted lg:text-left text-center">
          {siteCopy.footer.attribution}
        </p>
      </footer>
    </div>
  );
}