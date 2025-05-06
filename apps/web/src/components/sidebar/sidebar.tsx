import { SidebarLogo } from './sidebar-logo';

export function Sidebar() {
  return (
    <aside className="w-[272px] h-full flex flex-col border border-border-base px-4 py-4 gap-y-200">
      <SidebarLogo />
    </aside>
  );
}
