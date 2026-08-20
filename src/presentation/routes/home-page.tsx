import { siteCopy } from '@/presentation/copy/site';

export function HomePage() {
  return <h1 className="p-8 text-2xl font-semibold">{siteCopy.appName}</h1>;
}
