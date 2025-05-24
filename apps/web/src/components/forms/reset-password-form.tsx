'use client'

import { ResetPasswordFormType, resetPasswordValidation } from '@/shared/validations/reset-password-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@note-taking-app/ui/button'
import { useForm } from 'react-hook-form'
import { ControlledInput } from '../inputs/controlled-input'

export function ResetPasswordForm() {
	const form = useForm<ResetPasswordFormType>({
		defaultValues: {
			newPassword: '',
			confirmPassword: '',
		},
		resolver: zodResolver(resetPasswordValidation),
	})

	const { handleSubmit } = form

	async function onSubmit(data: ResetPasswordFormType) {
		console.log(data)
	}

	return (
		<form className='flex flex-col gap-y-200' onSubmit={handleSubmit(onSubmit)}>
			<ControlledInput
				name='newPassword'
				control={form.control}
				label='New Password'
				tip={{
					children: 'At least 8 characters',
				}}
				field={{
					type: 'password',
				}}
				required
			/>

			<ControlledInput
				name='confirmPassword'
				control={form.control}
				label='Confirm New Password'
				field={{
					type: 'password',
				}}
				required
			/>

			<Button className='h-11' type='submit'>
				Send Reset Link
			</Button>
		</form>
	)
}
