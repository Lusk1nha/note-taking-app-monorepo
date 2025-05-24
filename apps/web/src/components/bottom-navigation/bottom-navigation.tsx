import { PathSettings } from '@/shared/common/app-paths'
import { MobileRenderNavigation } from './mobile-render-navigation'

interface MobileBottomNavigationProps {
	paths: PathSettings[]
}

export function MobileBottomNavigation(
	props: Readonly<MobileBottomNavigationProps>,
) {
	const { paths } = props

	return (
		<div className='fixed bottom-0 left-0 right-0 z-50 block lg:hidden'>
			<nav className='w-full bg-mobile-bottom-navigation-base border-t border-mobile-bottom-navigation-border h-14 md:h-[74px] flex items-center px-4 md:px-8 shadow-inverse-small'>
				<MobileRenderNavigation paths={paths} />
			</nav>
		</div>
	)
}
