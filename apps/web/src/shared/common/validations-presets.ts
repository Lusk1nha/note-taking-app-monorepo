import { z } from 'zod';

export const EMAIL_VALIDATION = z
  .string({
    required_error: 'Email is required',
  })
  .email('Invalid email address');

export const PASSWORD_VALIDATION = z
  .string({
    required_error: 'Password is required',
  })
  .min(8, 'Password must be at least 8 characters long');
