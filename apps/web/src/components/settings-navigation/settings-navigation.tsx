import { defaultSettingsPaths, logoutPath } from '@/shared/common/app-paths';
import { SettingsNavigationRender } from './settings-navigation-render';
import { Separator } from '@note-taking-app/ui/separator';
import { SettingLinkItem } from './setting-link-item';

export function SettingsNavigation() {
  return (
    <div className="w-full h-full flex flex-col gap-y-100">
      <SettingsNavigationRender paths={defaultSettingsPaths} />
      <Separator />
      <SettingLinkItem path={logoutPath} />
    </div>
  );
}
