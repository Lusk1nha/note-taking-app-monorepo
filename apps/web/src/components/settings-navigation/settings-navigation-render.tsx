'use client';

import { AppPaths, PathSettings } from '@/shared/common/app-paths';
import { ItemFadeInAnimate, ListFadeInAnimate } from '../utilities/animation';

import { usePathname } from 'next/navigation';
import { SettingLinkItem } from './setting-link-item';

interface SettingsNavigationRenderProps {
  paths: PathSettings[];
}

export function SettingsNavigationRender(
  props: Readonly<SettingsNavigationRenderProps>,
) {
  const { paths } = props;

  const pathname = usePathname();

  return (
    <ListFadeInAnimate className="flex flex-col gap-y-100">
      {paths.map((path) => {
        const isActive =
          pathname === path.path ||
          path.aliasPaths?.includes(pathname as AppPaths);

        return (
          <ItemFadeInAnimate key={path.name}>
            <SettingLinkItem path={path} isActive={isActive} />
          </ItemFadeInAnimate>
        );
      })}
    </ListFadeInAnimate>
  );
}
