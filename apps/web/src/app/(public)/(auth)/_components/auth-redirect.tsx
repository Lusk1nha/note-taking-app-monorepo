'use client';

import { Text } from '@note-taking-app/ui/text';
import { cn } from '@note-taking-app/utils/cn';
import Link from 'next/link';

interface AuthRedirectProps {
  children: string;
  className?: string;

  redirectTo: {
    href: string;
    label: string;
  };
}

export function AuthRedirect(props: Readonly<AuthRedirectProps>) {
  const { children, className, redirectTo } = props;

  return (
    <div className="flex items-center justify-center">
      <Text size="sm" className={cn('text-auth-text text-center', className)}>
        {children}{' '}
        <Link className="text-auth-link hover:underline" href={redirectTo.href}>
          {redirectTo.label}
        </Link>
      </Text>
    </div>
  );
}
