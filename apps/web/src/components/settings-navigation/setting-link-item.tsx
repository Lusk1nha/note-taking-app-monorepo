import Link from 'next/link';

import { PathSettings } from '@/shared/common/app-paths';
import { Text } from '@note-taking-app/ui/text';
import { cn } from '@note-taking-app/utils/cn';

import { ChevronIcon } from '@note-taking-app/design-system/chevron-icon.tsx';

interface SettingLinkItemProps {
  path: PathSettings;
  isActive?: boolean;
  className?: string;
}

export function SettingLinkItem(props: Readonly<SettingLinkItemProps>) {
  const { path, isActive = false, className } = props;
  return (
    <Link
      className={cn('h-9 w-full flex cursor-pointer', className)}
      href={path.path}
    >
      <div
        className={cn(
          'w-full h-full flex items-center justify-between px-100 rounded-6',
          isActive && 'bg-setting-navigation-base-active',
        )}
      >
        <div className="flex items-center gap-x-100">
          <span
            className={cn(
              'text-setting-navigation-text',
              isActive && 'text-setting-navigation-icon-text-active',
            )}
          >
            {path.icon}
          </span>

          <Text
            className={cn(
              'text-setting-navigation-text',
              isActive && 'text-setting-navigation-text-active',
            )}
          >
            {path.name}
          </Text>
        </div>

        {isActive && (
          <ChevronIcon className="text-setting-navigation-icon-text-active" />
        )}
      </div>
    </Link>
  );
}
