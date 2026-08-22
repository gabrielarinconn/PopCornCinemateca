import { cn } from '@/presentation/lib/cn';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { User } from 'lucide-react';

export interface SidebarUserProfileProps {
  name?: string;
  avatarUrl?: string;
  isPremium?: boolean;
}

export function SidebarUserProfile({ name, avatarUrl, isPremium }: SidebarUserProfileProps) {
  const hasUser = !!name;

  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <Avatar
        {...(avatarUrl && { src: avatarUrl })}
        fallback={name ?? 'Usuario'}
        size="lg"
        className={cn('ring-2', hasUser ? 'ring-brand/30' : 'ring-border-subtle')}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {hasUser ? name : 'Usuario'}
        </p>
        {hasUser && isPremium && (
          <Badge variant="default" className="mt-1 bg-brand text-white text-[10px] px-2 py-0.5">
            Premium
          </Badge>
        )}
      </div>
      {!hasUser && (
        <User className="w-5 h-5 text-text-muted" aria-hidden="true" />
      )}
    </div>
  );
}