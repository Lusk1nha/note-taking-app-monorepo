import { ArchiveIcon } from '@note-taking-app/design-system/archive-icon.tsx';
import { HomeIcon } from '@note-taking-app/design-system/home-icon.tsx';
import { SearchIcon } from '@note-taking-app/design-system/search-icon.tsx';
import { SettingsIcon } from '@note-taking-app/design-system/settings-icon.tsx';
import { TagIcon } from '@note-taking-app/design-system/tag-icon.tsx';

import { JSX } from 'react';

export enum AppPaths {
  // Public
  Login = '/login',
  Register = '/register',

  Home = '/',
  Search = '/search',
  Archive = '/archive',
  Tags = '/tags',
  Settings = '/settings',
}

export type PathSettings = {
  name: string;
  path: AppPaths;
  icon: JSX.Element;
};

export const defaultBottomNavigationPaths: PathSettings[] = [
  {
    name: 'Home',
    path: AppPaths.Home,
    icon: <HomeIcon />,
  },
  {
    name: 'Search',
    path: AppPaths.Search,
    icon: <SearchIcon />,
  },
  {
    name: 'Archive',
    path: AppPaths.Archive,
    icon: <ArchiveIcon />,
  },
  {
    name: 'Tags',
    path: AppPaths.Tags,
    icon: <TagIcon />,
  },
  {
    name: 'Settings',
    path: AppPaths.Settings,
    icon: <SettingsIcon />,
  },
];
