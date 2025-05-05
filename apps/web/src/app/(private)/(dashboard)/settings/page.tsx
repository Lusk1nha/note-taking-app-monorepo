import { Title } from '@note-taking-app/ui/title';

export default function SettingsPage() {
  return (
    <div className="bg-dashboard-base w-full h-full -mt-1 z-10 rounded-12">
      <main className="flex flex-col py-6 px-4">
        <Title size="xl">Settings</Title>
      </main>
    </div>
  );
}
