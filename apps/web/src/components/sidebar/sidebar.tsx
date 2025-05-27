import { SidebarRoutes } from '@/components/sidebar/sidebar-routes';
import { defaultSidebarPaths } from '@/shared/common/app-paths';
import { Separator } from '@note-taking-app/ui/separator';
import { TagsRender } from '../tags-render/tags-render';
import { SidebarLogo } from './sidebar-logo';

export function Sidebar() {
  return (
    <aside className="w-[272px] h-full flex flex-col border border-border-base px-4 py-4 gap-y-200">
      <SidebarLogo />
      <nav className="flex flex-col gap-y-100">
        <SidebarRoutes paths={defaultSidebarPaths} />
        <Separator />
        <TagsRender />
      </nav>
    </aside>
  );
}
