import { z } from 'zod';
import { THEME_ENUM } from '../constants/theme-constants';

export const colorValidation = z.object({
  theme: THEME_ENUM,
});

export type ColorFormType = z.infer<typeof colorValidation>;
