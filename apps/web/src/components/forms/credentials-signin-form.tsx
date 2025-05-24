'use client'

import { AppPaths } from '@/shared/common/app-paths'
import { CredentialsSigninFormType, credentialsSigninValidation } from '@/shared/validations/credentials-signin-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@note-taking-app/ui/button'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { ControlledInput } from '../inputs/controlled-input'

export function CredentialsSignInForm() {
	const form = useForm<CredentialsSigninFormType>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(credentialsSigninValidation),
	})

	const { handleSubmit } = form

	async function onSubmit(data: CredentialsSigninFormType) {
		console.log(data)
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

			<ControlledInput
				name='password'
				control={form.control}
				label='Password'
				field={{
					type: 'password',
				}}
				actions={
					<Link
						className='text-auth-redirect-link system-preset-6 underline'
						href={AppPaths.ForgotPassword}
					>
						Forgot
					</Link>
				}
				required
			/>

			<Button className='h-11' type='submit'>
				Login
			</Button>
		</form>
	)
}
