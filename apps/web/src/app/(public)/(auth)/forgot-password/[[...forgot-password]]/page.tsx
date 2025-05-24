import { ForgotPasswordForm } from '@/components/forms/forgot-password-form'
import { AuthHeader } from '../../_components/auth-header'
import { AuthWrapper } from '../../_components/auth-wrapper'

export default function ForgotPasswordPage() {
	return (
		<AuthWrapper>
			<AuthHeader
				title='Forgotten your password?'
				description='Enter your email below, and we’ll send you a link to reset it.'
			/>

			<div className='flex flex-col gap-y-200'>
				<ForgotPasswordForm />
			</div>
		</AuthWrapper>
	)
}
