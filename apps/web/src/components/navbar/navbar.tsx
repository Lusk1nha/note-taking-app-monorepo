import React from 'react';
import { MobileNavbar } from './mobile-navbar';

export function Navbar() {
  return (
    <React.Fragment>
      <div className="block lg:hidden">
        <MobileNavbar />
      </div>
    </React.Fragment>
  );
}
