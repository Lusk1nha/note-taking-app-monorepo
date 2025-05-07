'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { OptionSelector } from '@note-taking-app/ui/option-selector';
import { Button } from '@note-taking-app/ui/button';
import { useTheme } from 'next-themes';

import { Controller, useForm } from 'react-hook-form';

import {
  THEME_OPTIONS,
  ThemeEnumType,
} from '@/shared/constants/theme-constants';

import {
  ColorFormType,
  colorValidation,
} from '@/shared/validations/color-theme-validation';

export function ColorThemeForm() {
  const { theme, setTheme } = useTheme();

  const form = useForm<ColorFormType>({
    defaultValues: {
      theme: theme as ThemeEnumType,
    },
    resolver: zodResolver(colorValidation),
  });

  const { handleSubmit } = form;

  async function onSubmit(data: ColorFormType) {
    const { theme } = data;
    setTheme(theme);
  }

  return (
    <form className="flex flex-col gap-y-250" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="theme"
        control={form.control}
        render={({ field: { onChange, value } }) => (
          <OptionSelector<ThemeEnumType>
            selectedId={value}
            onSelect={(id) => onChange(id)}
            options={THEME_OPTIONS}
          />
        )}
      />

      <div className="flex justify-end">
        <Button type="submit">Apply Changes</Button>
      </div>
    </form>
  );
}
