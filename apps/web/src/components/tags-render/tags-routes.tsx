'use client';

import { RedirectToAppPathAction } from '@/components/actions/redirect-to-app-path-action';
import {
  ItemFadeInAnimate,
  ListFadeInAnimate,
} from '@/components/utilities/animation';
import { AppPaths } from '@/shared/common/app-paths';
import { TagIcon } from '@note-taking-app/design-system/tag-icon.tsx';

interface TagsRoutesProps {
  paths: string[];
}

export function TagsRoutes(props: Readonly<TagsRoutesProps>) {
  const { paths } = props;

  return (
    <ListFadeInAnimate className="flex flex-col gap-y-050">
      {paths.map((path) => {
        const routePath = AppPaths.SearchTag.replace(':tag', path);

        return (
          <ItemFadeInAnimate key={path}>
            <RedirectToAppPathAction
              path={{
                icon: <TagIcon className="w-5 h-5" />,
                name: path,
                path: routePath as AppPaths,
              }}
            />
          </ItemFadeInAnimate>
        );
      })}
    </ListFadeInAnimate>
  );
}
