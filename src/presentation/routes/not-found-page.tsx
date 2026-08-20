import { Link } from 'react-router';
import { siteCopy } from '@/presentation/copy/site';

export function NotFoundPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{siteCopy.notFound.title}</h1>
      <p className="text-ink-muted">{siteCopy.notFound.description}</p>
      <Link to="/" className="underline">
        {siteCopy.notFound.backHome}
      </Link>
    </div>
  );
}
