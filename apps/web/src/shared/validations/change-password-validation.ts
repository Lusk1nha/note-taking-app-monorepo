import { z } from 'zod'
import { PASSWORD_VALIDATION } from '../common/validations-presets'

export const changePasswordValidation = z
	.object({
		oldPassword: z.string({
			required_error: 'Old password is required',
		}),

		newPassword: PASSWORD_VALIDATION,

		confirmPassword: PASSWORD_VALIDATION,
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'New password and confirm password must match',
		path: ['confirmPassword'],
	})

export type ChangePasswordFormType = z.infer<typeof changePasswordValidation>
