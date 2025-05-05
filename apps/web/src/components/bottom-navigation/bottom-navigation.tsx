import React from 'react';
import { MobileBottomNavigation } from './mobile-bottom-navigation';
import { defaultBottomNavigationPaths } from '@/shared/common/app-paths';

export function BottomNavigation() {
  return (
    <React.Fragment>
      <div className="block lg:hidden">
        <MobileBottomNavigation paths={defaultBottomNavigationPaths} />
      </div>
    </React.Fragment>
  );
}
