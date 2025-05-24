import { z } from 'zod'
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from '../common/validations-presets'

export const credentialsSigninValidation = z.object({
	email: EMAIL_VALIDATION,
	password: PASSWORD_VALIDATION,
})

export type CredentialsSigninFormType = z.infer<
	typeof credentialsSigninValidation
>
