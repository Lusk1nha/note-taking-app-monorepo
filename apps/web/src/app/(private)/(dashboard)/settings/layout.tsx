import { NextArtefactProps } from '@/shared/common/next-types';
import { cn } from '@note-taking-app/utils/cn';

interface SettingsLayoutProps extends NextArtefactProps {
  audience: React.ReactNode;
}

export default function SettingsLayout({
  children,
  audience,
}: Readonly<SettingsLayoutProps>) {
  return (
    <div className="bg-dashboard-base w-full h-full -mt-1 z-10 rounded-12">
      <main className="w-full h-full flex flex-col lg:flex-row gap-y-200">
        <div
          className={cn(
            'lg:w-64 lg:border-r pt-300 px-150 lg:pl-400 lg:pt-250 lg:pr-200',
            !!audience && 'hidden lg:block',
          )}
        >
          {children}
        </div>

        {audience}
      </main>
    </div>
  );
}
