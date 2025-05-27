'use client';

import { PathSettings } from '@/shared/common/app-paths';
import { RedirectToAppPathAction } from '../actions/redirect-to-app-path-action';

interface SettingsNavigationRenderProps {
  paths: PathSettings[];
}

export function SettingsNavigationRender(props: Readonly<SettingsNavigationRenderProps>) {
  const { paths } = props;

  return (
    <ul className="flex flex-col gap-y-100">
      {paths.map((path) => (
        <li key={path.name}>
          <RedirectToAppPathAction path={path} />
        </li>
      ))}
    </ul>
  );
}
