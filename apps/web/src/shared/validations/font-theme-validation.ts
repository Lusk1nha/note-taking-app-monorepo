import { z } from 'zod'
import { FONT_ENUM } from '../constants/font-constants'

export const fontValidation = z.object({
	font: FONT_ENUM,
})

export type FontFormType = z.infer<typeof fontValidation>
