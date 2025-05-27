import { PathSettings } from '@/shared/common/app-paths';
import { Text } from '@note-taking-app/ui/text';
import { cn } from '@note-taking-app/utils/cn';
import Link from 'next/link';

interface MobileItemLinkProps {
  path: PathSettings;
  isActive?: boolean;
}

export function MobileItemLink(props: Readonly<MobileItemLinkProps>) {
  const { path, isActive } = props;
  return (
    <Link href={path.path} className="w-full flex items-center justify-center cursor-pointer">
      <div
        className={cn(
          'w-full flex items-center flex-col gap-y-050 py-050 rounded-4',
          isActive && 'bg-mobile-bottom-navigation-icon-base-active'
        )}
      >
        <span
          className={cn(
            'text-mobile-bottom-navigation-icon-text',
            isActive && 'text-mobile-bottom-navigation-icon-text-active'
          )}
        >
          {path.icon}
        </span>
        <Text
          size="xs"
          className={cn(
            'hidden md:block text-mobile-bottom-navigation-text',
            isActive && 'text-mobile-bottom-navigation-text-active'
          )}
        >
          {path.name}
        </Text>
      </div>
    </Link>
  );
}
