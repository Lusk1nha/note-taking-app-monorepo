import { RedirectToSettingsAction } from '@/components/actions/redirect-to-settings-action';
import { SettingsIcon } from '@note-taking-app/design-system/settings-icon.tsx';
import { Title } from '@note-taking-app/ui/title';

import { SearchContentForm } from '@/components/forms/search-content-form';

export default function TopNavigations() {
  return (
    <div className="hidden lg:flex">
      <header className="w-full h-20 flex items-center justify-between border-b border-border-base px-8 z-20">
        <Title size="xl">Settings</Title>

        <div className="flex items-center gap-x-200">
          <SearchContentForm />

          <RedirectToSettingsAction className="w-10 h-10 p-0">
            <span className="sr-only">Settings</span>
            <SettingsIcon className="w-5 h-5" />
          </RedirectToSettingsAction>
        </div>
      </header>
    </div>
  );
}
