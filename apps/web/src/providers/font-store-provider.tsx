'use client';

import {
  createFontStore,
  FontEnum,
  FontStore,
  FontStoreState,
} from '@/shared/stores/font-store';
import { cn } from '@note-taking-app/utils/cn';
import { Inter, Noto_Serif, Source_Code_Pro } from 'next/font/google';
import { createContext, useContext, useMemo, useRef } from 'react';
import { useStore } from 'zustand';

const interFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
});

export type FontStoreApi = ReturnType<typeof createFontStore>;

export const FontStoreContext = createContext<FontStoreApi | undefined>(
  undefined,
);

interface FontStoreProviderProps {
  children: React.ReactNode;
  storageKey?: string;
  initialState?: FontStore;
}

export function fontMapper(font: FontEnum) {
  switch (font) {
    case FontEnum.SansSerif:
      return interFont.className;
    case FontEnum.Serif:
      return notoSerif.className;
    case FontEnum.Monospace:
      return sourceCodePro.className;
  }
}

export function FontStoreProvider(props: Readonly<FontStoreProviderProps>) {
  const { children, storageKey, initialState } = props;

  const storeRef = useRef<FontStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createFontStore(storageKey, initialState);
  }

  const currentFont = useStore(storeRef.current, (state) => state.currentFont);
  const currentFontClassName = useMemo(
    () => fontMapper(currentFont),
    [currentFont],
  );

  return (
    <FontStoreContext.Provider value={storeRef.current}>
      <div data-testid="font-provider" className={cn(currentFontClassName)}>
        {children}
      </div>
    </FontStoreContext.Provider>
  );
}

export const useFontStore = <T,>(selector: (store: FontStoreState) => T): T => {
  const store = useContext(FontStoreContext);

  if (!store) {
    throw new Error('useFontStore must be used within a FontStoreProvider');
  }

  return useStore(store, selector);
};
