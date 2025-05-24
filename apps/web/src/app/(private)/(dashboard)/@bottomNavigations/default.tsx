import { MobileBottomNavigation } from '@/components/bottom-navigation/bottom-navigation'
import { defaultBottomNavigationPaths } from '@/shared/common/app-paths'

export default function BottomNavigationDefault() {
	return (
		<div className='block lg:hidden'>
			<MobileBottomNavigation paths={defaultBottomNavigationPaths} />
		</div>
	)
}
