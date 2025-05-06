import Link from 'next/link';

import { AppPaths } from '@/shared/common/app-paths';
import { ArrowIcon } from '@note-taking-app/design-system/arrow-icon.tsx';
import { Button } from '@note-taking-app/ui/button';

export function RedirectToSettingsAction() {
  return (
    <Link className="w-fit flex items-center" href={AppPaths.Settings}>
      <Button className="gap-x-100 p-0" variant="ghost">
        <ArrowIcon className="w-5 h-5" />
        Settings
      </Button>
    </Link>
  );
}
