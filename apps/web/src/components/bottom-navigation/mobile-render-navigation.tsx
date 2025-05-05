'use client';

import { PathSettings } from '@/shared/common/app-paths';
import { ItemFadeInAnimate, ListFadeInAnimate } from '../utilities/animation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@note-taking-app/utils/cn';
import { Separator } from '@note-taking-app/ui/separator';
import React from 'react';

interface MobileRenderNavigationProps {
  paths: PathSettings[];
}

export function MobileRenderNavigation(
  props: Readonly<MobileRenderNavigationProps>,
) {
  const { paths } = props;

  const pathname = usePathname();

  return (
    <ListFadeInAnimate className="w-full h-full flex items-center justify-around py-150">
      {paths.map((path) => {
        const isActive = pathname === path.path;

        return (
          <React.Fragment key={path.path}>
            <ItemFadeInAnimate className="w-full max-w-20">
              <MobileNavigationLink path={path} isActive={isActive} />
            </ItemFadeInAnimate>

            <Separator
              className="h-full hidden md:block last-of-type:hidden"
              size="vertical"
            />
          </React.Fragment>
        );
      })}
    </ListFadeInAnimate>
  );
}

interface MobileNavigationLinkProps {
  path: PathSettings;
  isActive?: boolean;
}

export function MobileNavigationLink(
  props: Readonly<MobileNavigationLinkProps>,
) {
  const { path, isActive } = props;
  return (
    <Link
      href={path.path}
      className="w-full flex items-center justify-center cursor-pointer"
    >
      <div
        className={cn(
          'w-full flex items-center flex-col gap-y-050 py-050 rounded-4',
          isActive && 'bg-mobile-bottom-navigation-icon-base-active',
        )}
      >
        <span
          className={cn(
            'text-mobile-bottom-navigation-icon-text',
            isActive && 'text-mobile-bottom-navigation-icon-text-active',
          )}
        >
          {path.icon}
        </span>
        <span
          className={cn(
            'hidden md:block system-preset-6 text-mobile-bottom-navigation-text',
            isActive && 'text-mobile-bottom-navigation-text-active',
          )}
        >
          {path.name}
        </span>
      </div>
    </Link>
  );
}
