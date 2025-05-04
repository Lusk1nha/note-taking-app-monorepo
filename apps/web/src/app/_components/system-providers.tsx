'use client';

import { FontStoreProvider } from '@/providers/font-store-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { SWRConfig } from 'swr';

interface SystemProvidersProps {
  children: React.ReactNode;
}

export function SystemProviders(props: Readonly<SystemProvidersProps>) {
  const { children } = props;
  return (
    <ThemeProvider storageKey="web.theme">
      <FontStoreProvider storageKey="web.font">
        <SWRConfig value={{ revalidateOnFocus: false }}>{children}</SWRConfig>
      </FontStoreProvider>
    </ThemeProvider>
  );
}
