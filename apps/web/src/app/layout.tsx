import { bootstrap } from '@/shared/bootstrap'

import { APP_DESCRIPTION, APP_NAME } from '@/shared/constants'
import type { Metadata } from 'next'

import '@note-taking-app/design-system/styles.css'
import '@note-taking-app/ui/styles.css'
import './styles.css'

import { NextArtefactProps } from '@/shared/common/next-types'
import { SystemProviders } from './_components/system-providers'

bootstrap()

export const metadata: Metadata = {
	title: APP_NAME,
	description: APP_DESCRIPTION,

	icons: {
		icon: '/assets/images/favicon-32x32.png',
		shortcut: '/assets/images/favicon-32x32.png',
	},
}

export default function RootLayout({ children }: Readonly<NextArtefactProps>) {
	return (
		<html lang='en'>
			<body>
				<SystemProviders>{children}</SystemProviders>
			</body>
		</html>
	)
}
