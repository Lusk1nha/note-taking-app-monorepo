import { z } from 'zod';

export const changePasswordValidation = z
  .object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),

    newPassword: z.string({
      required_error: 'New password is required',
    }),
    confirmPassword: z.string({
      required_error: 'Confirm password is required',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirm password must match',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormType = z.infer<typeof changePasswordValidation>;
