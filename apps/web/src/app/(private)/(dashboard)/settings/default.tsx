import { SettingsNavigation } from '@/components/settings-navigation/settings-navigation';
import { Title } from '@note-taking-app/ui/title';

export default function SettingsDefault() {
  return (
    <div className="flex flex-col gap-y-200">
      <div className="lg:hidden">
        <Title size="xl">Settings</Title>
      </div>

      <SettingsNavigation />
    </div>
  );
}
