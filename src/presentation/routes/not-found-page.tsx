import { Link } from 'react-router';
import { siteCopy } from '@/presentation/copy/site';
import { PageContainer } from '@/presentation/components/layout/PageContainer';

export function NotFoundPage() {
  return (
    <PageContainer className="py-8">
      <h1 className="text-2xl font-semibold">{siteCopy.notFound.title}</h1>
      <p className="text-ink-muted">{siteCopy.notFound.description}</p>
      <Link to="/" className="underline">
        {siteCopy.notFound.backHome}
      </Link>
    </PageContainer>
  );
}
