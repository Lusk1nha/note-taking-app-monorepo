'use client'

import { RedirectToAppPathAction } from '@/components/actions/redirect-to-app-path-action'
import { PathSettings } from '@/shared/common/app-paths'

interface SidebarRoutesProps {
	paths: PathSettings[]
}

export function SidebarRoutes(props: Readonly<SidebarRoutesProps>) {
	const { paths } = props

	return (
		<ul className='flex flex-col gap-y-050'>
			{paths.map((path) => (
				<li key={path.name}>
					<RedirectToAppPathAction path={path} />
				</li>
			))}
		</ul>
	)
}
