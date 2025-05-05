'use client';

import { AppPaths, PathSettings } from '@/shared/common/app-paths';
import { ItemFadeInAnimate, ListFadeInAnimate } from '../utilities/animation';

import { usePathname } from 'next/navigation';

import { Separator } from '@note-taking-app/ui/separator';
import React from 'react';
import { MobileItemLink } from './mobile-link-item';

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
        const isActive =
          pathname === path.path ||
          path.aliasPaths?.includes(pathname as AppPaths);

        return (
          <React.Fragment key={path.path}>
            <ItemFadeInAnimate className="w-full max-w-20">
              <MobileItemLink path={path} isActive={isActive} />
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
