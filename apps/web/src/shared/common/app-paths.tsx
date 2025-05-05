import { ArchiveIcon } from '@note-taking-app/design-system/archive-icon.tsx';
import { FontIcon } from '@note-taking-app/design-system/font-icon.tsx';
import { HomeIcon } from '@note-taking-app/design-system/home-icon.tsx';
import { LockIcon } from '@note-taking-app/design-system/lock-icon.tsx';
import { LogoutIcon } from '@note-taking-app/design-system/logout-icon.tsx';
import { SearchIcon } from '@note-taking-app/design-system/search-icon.tsx';
import { SettingsIcon } from '@note-taking-app/design-system/settings-icon.tsx';
import { SunIcon } from '@note-taking-app/design-system/sun-icon.tsx';
import { TagIcon } from '@note-taking-app/design-system/tag-icon.tsx';

import { JSX } from 'react';

export enum AppPaths {
  // Public
  Login = '/login',
  Register = '/register',
  Logout = '/logout',

  Home = '/',
  Search = '/search',
  Archive = '/archive',
  Tags = '/tags',
  Settings = '/settings',

  ColorTheme = '/settings/color-theme',
  FontTheme = '/settings/font-theme',
  ChangePassword = '/settings/change-password',
}

export type PathSettings = {
  name: string;
  path: AppPaths;

  icon: JSX.Element;
  description?: string;

  aliasPaths?: AppPaths[];
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
    aliasPaths: [
      AppPaths.ColorTheme,
      AppPaths.FontTheme,
      AppPaths.ChangePassword,
    ],
  },
];

export const defaultSettingsPaths: PathSettings[] = [
  {
    name: 'Color Theme',
    path: AppPaths.ColorTheme,
    icon: <SunIcon />,
  },
  {
    name: 'Font Theme',
    path: AppPaths.FontTheme,
    icon: <FontIcon />,
  },
  {
    name: 'Change Password',
    path: AppPaths.ChangePassword,
    icon: <LockIcon />,
  },
];

export const logoutPath: PathSettings = {
  name: 'Logout',
  path: AppPaths.Logout,
  icon: <LogoutIcon />,
};
