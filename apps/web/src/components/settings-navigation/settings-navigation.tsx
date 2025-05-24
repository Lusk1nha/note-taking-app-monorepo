'use client'

import { defaultSettingsPaths, logoutPath } from '@/shared/common/app-paths'
import { Separator } from '@note-taking-app/ui/separator'
import { SettingsNavigationRender } from './settings-navigation-render'

import { RedirectToAppPathAction } from '../actions/redirect-to-app-path-action'

export function SettingsNavigation() {
	return (
		<div className='w-full h-full flex flex-col gap-y-100'>
			<SettingsNavigationRender paths={defaultSettingsPaths} />
			<Separator />

			<RedirectToAppPathAction path={logoutPath} />
		</div>
	)
}
