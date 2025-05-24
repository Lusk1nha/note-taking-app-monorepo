import { RedirectToSettingsAction } from '@/components/actions/redirect-to-settings-action'
import { NextArtefactProps } from '@/shared/common/next-types'
import { ArrowIcon } from '@note-taking-app/design-system/arrow-icon.tsx'

export default function AudienceLayout(props: Readonly<NextArtefactProps>) {
	const { children } = props

	return (
		<section className='bg-dashboard-base w-full h-full absolute lg:static lg:w-[528px] flex flex-col gap-y-200 pt-6 px-4 lg:p-8 z-20'>
			<div className='lg:hidden'>
				<RedirectToSettingsAction className='gap-x-100 p-0'>
					<ArrowIcon className='w-5 h-5' />
					Settings
				</RedirectToSettingsAction>
			</div>
			{children}
		</section>
	)
}
