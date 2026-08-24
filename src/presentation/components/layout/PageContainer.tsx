import type { ReactNode } from 'react';
import { cn } from '@/presentation/lib/cn';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('px-6 lg:px-10 pb-32', className)}>
      {children}
    </div>
  );
}
