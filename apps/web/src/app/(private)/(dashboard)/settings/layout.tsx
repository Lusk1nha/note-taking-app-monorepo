import { NextArtefactProps } from '@/shared/common/next-types';
import { cn } from '@note-taking-app/utils/cn';

interface SettingsLayoutProps extends NextArtefactProps {
  audience: React.ReactNode;
  controls: React.ReactNode;
}

export default function SettingsLayout({
  audience,
  controls,
}: Readonly<SettingsLayoutProps>) {
  return (
    <div className="bg-dashboard-base w-full h-full -mt-1 z-10 rounded-12">
      <main className="w-full h-full flex flex-col lg:flex-row gap-y-200">
        {controls}
        {audience && audience}
      </main>
    </div>
  );
}
