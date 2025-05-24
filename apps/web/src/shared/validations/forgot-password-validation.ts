import { z } from 'zod'
import { EMAIL_VALIDATION } from '../common/validations-presets'

export const forgotPasswordValidation = z.object({
	email: EMAIL_VALIDATION,
})

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordValidation>
