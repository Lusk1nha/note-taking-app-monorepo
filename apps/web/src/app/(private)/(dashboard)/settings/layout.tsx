import { NextArtefactProps } from '@/shared/common/next-types';

interface SettingsLayoutProps extends NextArtefactProps {
  audience: React.ReactNode;
  controls: React.ReactNode;
}

export default function SettingsLayout({ audience, controls }: Readonly<SettingsLayoutProps>) {
  return (
    <main className="w-full h-full flex flex-col lg:flex-row gap-y-200 relative">
      {controls}
      {audience}
    </main>
  );
}
