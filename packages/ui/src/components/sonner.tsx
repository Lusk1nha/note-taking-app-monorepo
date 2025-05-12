'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export interface CustomToasterProps extends ToasterProps {
  /**
   * The theme of the toaster.
   * @default 'system'
   */
  theme?: 'light' | 'dark' | 'system';
}

const Toaster = ({ ...props }: CustomToasterProps) => {
  const { theme = 'system' } = props;

  return <Sonner theme={theme as ToasterProps['theme']} {...props} />;
};

Toaster.displayName = 'Toaster';

export { Toaster };
