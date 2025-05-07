import Link from 'next/link';

import { AppPaths } from '@/shared/common/app-paths';
import { Button } from '@note-taking-app/ui/button';
import { cn } from '@note-taking-app/utils/cn';

interface RedirectToSettingsActionProps {
  children: React.ReactNode;
  className?: string;
}

export function RedirectToSettingsAction(
  props: Readonly<RedirectToSettingsActionProps>,
) {
  const { children, className } = props;

  return (
    <Link className="w-fit flex items-center" href={AppPaths.Settings}>
      <Button className={cn(className)} variant="ghost">
        {children}
      </Button>
    </Link>
  );
}
