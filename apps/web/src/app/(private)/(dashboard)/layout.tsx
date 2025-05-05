import { NextArtefactProps } from '@/shared/common/next-types';

import { BottomNavigation } from '@/components/bottom-navigation/bottom-navigation';
import { Navbar } from '@/components/navbar/navbar';

export default function DashboardLayout(props: Readonly<NextArtefactProps>) {
  const { children } = props;
  return (
    <div className="w-full h-screen">
      <Navbar />
      {children}
      <BottomNavigation />
    </div>
  );
}
