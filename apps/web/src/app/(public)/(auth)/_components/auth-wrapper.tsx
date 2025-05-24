import { LogoIcon } from '@note-taking-app/design-system/logo-icon.tsx'
import { cn } from '@note-taking-app/utils/cn'

interface AuthWrapperProps {
	children?: React.ReactNode
	className?: string
}

export function AuthWrapper(props: Readonly<AuthWrapperProps>) {
	const { children, className } = props

	return (
		<div
			className={cn(
				'bg-auth-content-base w-full max-w-[540px] sm:w-[522px] lg:w-[540px] rounded-12 shadow-large dark:shadow-none border border-auth-border',
				className,
			)}
		>
			<div className='w-full h-full flex flex-col px-200 sm:px-400 lg:px-600 py-600 gap-y-200'>
				<header className='flex items-center justify-center'>
					<LogoIcon />
				</header>

				<main className='flex flex-col gap-y-500'>{children}</main>
			</div>
		</div>
	)
}
