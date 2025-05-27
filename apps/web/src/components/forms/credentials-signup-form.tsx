'use client';

import {
  CredentialsSignupFormType,
  credentialsSignupValidation,
} from '@/shared/validations/credentials-signup-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@note-taking-app/ui/button';
import { useForm } from 'react-hook-form';
import { ControlledInput } from '../inputs/controlled-input';

export function CredentialsSignUpForm() {
  const form = useForm<CredentialsSignupFormType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(credentialsSignupValidation),
  });

  const { handleSubmit } = form;

  async function onSubmit(data: CredentialsSignupFormType) {
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

      <ControlledInput
        name="password"
        control={form.control}
        label="Password"
        tip={{
          children: 'At least 8 characters',
        }}
        field={{
          type: 'password',
        }}
        required
      />

      <Button className="h-11" type="submit">
        Sign Up
      </Button>
    </form>
  );
}
