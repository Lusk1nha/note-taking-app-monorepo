import { SettingsNavigation } from '@/components/settings-navigation/settings-navigation';
import { Title } from '@note-taking-app/ui/title';

export default function ControlsDefault() {
  return (
    <div className="lg:w-64 lg:border-r pt-300 px-150 lg:pl-400 lg:pt-250 lg:pr-200">
      <div className="flex flex-col gap-y-200">
        <div className="lg:hidden">
          <Title size="xl">Settings</Title>
        </div>
        <SettingsNavigation />
      </div>
    </div>
  );
}
