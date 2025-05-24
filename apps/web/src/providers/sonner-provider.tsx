import { ThemeEnumType } from '@/shared/constants/theme-constants'
import { Toaster } from '@note-taking-app/ui/sonner'
import { useTheme } from 'next-themes'

export function SonnerProvider() {
	const { theme } = useTheme()
	return <Toaster theme={theme as ThemeEnumType} />
}
