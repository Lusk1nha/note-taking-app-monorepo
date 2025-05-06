'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { OptionSelector } from '@note-taking-app/ui/option-selector';
import { Button } from '@note-taking-app/ui/button';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFontStore } from '@/providers/font-store-provider';
import { FontEnum } from '@/shared/stores/font-store';
import { FontSansSerifIcon } from '@note-taking-app/design-system/font-sans-serif-icon.tsx';
import { FontSerifIcon } from '@note-taking-app/design-system/font-serif-icon.tsx';
import { FontMonospaceIcon } from '@note-taking-app/design-system/font-monospace-icon.tsx';

const fontValidation = z.object({
  font: z.enum(['sans-serif', 'serif', 'monospace']),
});

type FontFormType = z.infer<typeof fontValidation>;

export function FontThemeForm() {
  const font = useFontStore((state) => state.currentFont);
  const setFont = useFontStore((state) => state.setFont);

  const form = useForm<FontFormType>({
    defaultValues: {
      font: font as FontFormType['font'],
    },
    resolver: zodResolver(fontValidation),
  });

  const { handleSubmit } = form;

  async function onSubmit(data: FontFormType) {
    const { font } = data;
    setFont(font as FontEnum);
  }

  return (
    <form className="flex flex-col gap-y-250" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="font"
        control={form.control}
        render={({ field: { onChange, value } }) => (
          <OptionSelector<FontFormType['font']>
            selectedId={value}
            onSelect={(id) => onChange(id)}
            options={[
              {
                id: 'sans-serif',
                name: 'Sans-serif',
                description: 'Clean and modern, easy to read.',
                icon: <FontSansSerifIcon className="h-6 w-6" />,
              },
              {
                id: 'serif',
                name: 'Serif',
                description: 'Classic and elegant for a timeless feel.',
                icon: <FontSerifIcon className="h-6 w-6" />,
              },
              {
                id: 'monospace',
                name: 'Monospace',
                description: 'Code-like, great for a technical vibe.',
                icon: <FontMonospaceIcon className="h-6 w-6" />,
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
