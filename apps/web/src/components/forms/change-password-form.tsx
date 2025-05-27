'use client';

import {
  ChangePasswordFormType,
  changePasswordValidation,
} from '@/shared/validations/change-password-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@note-taking-app/ui/button';
import { ControlledInput } from '../inputs/controlled-input';

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordValidation),
  });

  const { handleSubmit, formState } = form;

  async function onSubmit(data: ChangePasswordFormType) {
    const payload = data;
    // Call your API to change the password here
    console.log(payload);
  }

  return (
    <form className="flex flex-col gap-y-300" onSubmit={handleSubmit(onSubmit)}>
      <ControlledInput
        label="Old Password"
        name="oldPassword"
        control={form.control}
        field={{
          type: 'password',
        }}
        required
      />

      <ControlledInput
        label="New Password"
        name="newPassword"
        control={form.control}
        tip={{
          children: 'At least 8 characters',
        }}
        field={{
          type: 'password',
        }}
        required
      />

      <ControlledInput
        label="Confirm New Password"
        name="confirmPassword"
        control={form.control}
        field={{
          type: 'password',
        }}
        required
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={formState.isSubmitting}>
          Save Password
        </Button>
      </div>
    </form>
  );
}
