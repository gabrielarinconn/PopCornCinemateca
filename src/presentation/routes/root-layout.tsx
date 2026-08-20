import { Outlet, Link } from 'react-router';
import { siteCopy } from '@/presentation/copy/site';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-ink">
      <header className="p-4">
        <Link to="/" className="font-semibold">
          {siteCopy.appName}
        </Link>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="p-4 text-ink-muted text-sm">
        <p>{siteCopy.footer.attribution}</p>
      </footer>
    </div>
  );
}
