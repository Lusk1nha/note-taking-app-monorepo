'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MoonIcon } from '@note-taking-app/design-system/moon-icon.tsx';
import { SunIcon } from '@note-taking-app/design-system/sun-icon.tsx';
import { SystemIcon } from '@note-taking-app/design-system/system-icon.tsx';
import { OptionSelector } from '@note-taking-app/ui/option-selector';
import { Button } from '@note-taking-app/ui/button';
import { useTheme } from 'next-themes';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const colorValidation = z.object({
  theme: z.enum(['light', 'dark', 'system']),
});

type ColorFormType = z.infer<typeof colorValidation>;

export function ColorThemeForm() {
  const { theme, setTheme } = useTheme();

  const form = useForm<ColorFormType>({
    defaultValues: {
      theme: theme as ColorFormType['theme'],
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
          <OptionSelector<ColorFormType['theme']>
            selectedId={value}
            onSelect={(id) => onChange(id)}
            options={[
              {
                id: 'light',
                name: 'Light Mode',
                description: 'Pick a clean and classic light theme',
                icon: <SunIcon className="h-6 w-6" />,
              },
              {
                id: 'dark',
                name: 'Dark Mode',
                description: 'Select a sleek and modern dark theme',
                icon: <MoonIcon className="h-6 w-6" />,
              },
              {
                id: 'system',
                name: 'System',
                description: 'Adapts to your device’s theme',
                icon: <SystemIcon className="h-6 w-6" />,
              },
            ]}
          />
        )}
      />

      <div className="flex justify-end">
        <Button type="submit">Apply Changes</Button>
      </div>
    </form>
  );
}
