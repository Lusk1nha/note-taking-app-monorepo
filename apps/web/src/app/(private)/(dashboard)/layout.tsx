import { NextArtefactProps } from '@/shared/common/next-types';

interface DashboardLayoutProps extends NextArtefactProps {
  sidebar: React.ReactNode;
  navbar: React.ReactNode;
  bottomNavigations: React.ReactNode;
}

export default function DashboardLayout({
  children,
  sidebar,
  navbar,
  bottomNavigations,
}: Readonly<DashboardLayoutProps>) {
  return (
    <div className="w-full h-screen">
      {navbar}
      <div className="flex w-full h-full">
        {sidebar}

        <div>{children}</div>
      </div>
      {bottomNavigations}
    </div>
  );
}
