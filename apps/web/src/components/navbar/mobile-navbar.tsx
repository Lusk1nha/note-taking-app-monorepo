import { LogoIcon } from '@note-taking-app/design-system/logo-icon.tsx';

export function MobileNavbar() {
  return (
    <div className="bg-mobile-navbar-base w-full h-18 md:h-20">
      <div className="flex items-center h-full px-4 md:px-8 text-mobile-navbar-text">
        <LogoIcon />
      </div>
    </div>
  );
}
