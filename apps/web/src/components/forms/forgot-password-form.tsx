'use client';

import {
  ForgotPasswordFormType,
  forgotPasswordValidation,
} from '@/shared/validations/forgot-password-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ControlledInput } from '../inputs/controlled-input';
import { Button } from '@note-taking-app/ui/button';

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormType>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordValidation),
  });

  const { handleSubmit } = form;

  async function onSubmit(data: ForgotPasswordFormType) {
    console.log(data);
  }

  return (
    <form className="flex flex-col gap-y-300" onSubmit={handleSubmit(onSubmit)}>
      <ControlledInput
        name="email"
        control={form.control}
        label="Email Address"
        field={{
          placeholder: 'email@example.com',
        }}
        required
      />

      <Button className="h-11" type="submit">
        Send Reset Link
      </Button>
    </form>
  );
}
