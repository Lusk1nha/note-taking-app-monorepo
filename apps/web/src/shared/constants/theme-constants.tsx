import { MoonIcon } from '@note-taking-app/design-system/moon-icon.tsx'
import { SunIcon } from '@note-taking-app/design-system/sun-icon.tsx'
import { SystemIcon } from '@note-taking-app/design-system/system-icon.tsx'
import { OptionType } from '@note-taking-app/ui/option-selector'
import { z } from 'zod'

export const THEME_ENUM = z.enum(['light', 'dark', 'system'])

export type ThemeEnumType = z.infer<typeof THEME_ENUM>

export const THEME_OPTIONS: OptionType<ThemeEnumType>[] = [
	{
		id: 'light',
		name: 'Light Mode',
		description: 'Pick a clean and classic light theme',
		icon: <SunIcon className='h-6 w-6' />,
	},
	{
		id: 'dark',
		name: 'Dark Mode',
		description: 'Select a sleek and modern dark theme',
		icon: <MoonIcon className='h-6 w-6' />,
	},
	{
		id: 'system',
		name: 'System',
		description: 'Adapts to your device’s theme',
		icon: <SystemIcon className='h-6 w-6' />,
	},
]
