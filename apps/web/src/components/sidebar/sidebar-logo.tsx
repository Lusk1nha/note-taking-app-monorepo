import { AppPaths } from '@/shared/common/app-paths';
import { LogoIcon } from '@note-taking-app/design-system/logo-icon.tsx';
import Link from 'next/link';

export function SidebarLogo() {
  return (
    <div className="w-full h-13 flex items-center">
      <Link href={AppPaths.Home}>
        <LogoIcon />
      </Link>
    </div>
  );
}
