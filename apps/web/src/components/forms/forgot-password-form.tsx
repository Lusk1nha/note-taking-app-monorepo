'use client'

import { ForgotPasswordFormType, forgotPasswordValidation } from '@/shared/validations/forgot-password-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@note-taking-app/ui/button'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ControlledInput } from '../inputs/controlled-input'
import { SuccessToast } from '../toasts/success-toast'

export function ForgotPasswordForm() {
	const form = useForm<ForgotPasswordFormType>({
		defaultValues: {
			email: '',
		},
		resolver: zodResolver(forgotPasswordValidation),
	})

	const { handleSubmit } = form

	async function onSubmit(data: ForgotPasswordFormType) {
		console.log(data)
		toast.custom((t) => (
			<SuccessToast
				id={t}
				title='Reset password link sent to the email.'
				tag='Forgot Password'
			/>
		))
	}

	return (
		<form className='flex flex-col gap-y-300' onSubmit={handleSubmit(onSubmit)}>
			<ControlledInput
				name='email'
				control={form.control}
				label='Email Address'
				field={{
					placeholder: 'email@example.com',
				}}
				required
			/>

			<Button className='h-11' type='submit'>
				Send Reset Link
			</Button>
		</form>
	)
}
