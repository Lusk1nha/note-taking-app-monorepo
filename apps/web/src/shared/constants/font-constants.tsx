import { FontMonospaceIcon } from '@note-taking-app/design-system/font-monospace-icon.tsx';
import { FontSansSerifIcon } from '@note-taking-app/design-system/font-sans-serif-icon.tsx';
import { FontSerifIcon } from '@note-taking-app/design-system/font-serif-icon.tsx';
import { OptionType } from '@note-taking-app/ui/option-selector';
import { z } from 'zod';

export const FONT_ENUM = z.enum(['sans-serif', 'serif', 'monospace']);

export type FontEnumType = z.infer<typeof FONT_ENUM>;

export const FONT_OPTIONS: OptionType<FontEnumType>[] = [
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
];
