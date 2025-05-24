'use client'

import { FontStoreProvider } from '@/providers/font-store-provider'
import { SonnerProvider } from '@/providers/sonner-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import { SWRConfig } from 'swr'

interface SystemProvidersProps {
	children: React.ReactNode
}

export function SystemProviders(props: Readonly<SystemProvidersProps>) {
	const { children } = props
	return (
		<ThemeProvider storageKey='web.theme'>
			<FontStoreProvider storageKey='web.font'>
				<SWRConfig value={{ revalidateOnFocus: false }}>
					<SonnerProvider />
					{children}
				</SWRConfig>
			</FontStoreProvider>
		</ThemeProvider>
	)
}
