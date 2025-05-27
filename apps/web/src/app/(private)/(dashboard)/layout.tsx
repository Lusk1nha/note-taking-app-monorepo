import { NextArtefactProps } from '@/shared/common/next-types';

interface DashboardLayoutProps extends NextArtefactProps {
  sidebar: React.ReactNode;
  navbar: React.ReactNode;

  topNavigations: React.ReactNode;
  bottomNavigations: React.ReactNode;
}

export default function DashboardLayout({
  children,
  sidebar,
  navbar,
  bottomNavigations,
  topNavigations,
}: Readonly<DashboardLayoutProps>) {
  return (
    <div className="w-full h-screen">
      {navbar}

      <div className="flex w-full h-full">
        {sidebar}

        <div id="dashboard-children" className="w-full h-full flex flex-col">
          {topNavigations}

          <div className="bg-dashboard-base w-full h-full -mt-2 lg:mt-0 z-10 rounded-12">
            {children}
          </div>
        </div>
      </div>

      {bottomNavigations}
    </div>
  );
}
