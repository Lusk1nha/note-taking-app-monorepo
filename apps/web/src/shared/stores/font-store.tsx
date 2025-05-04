import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export enum FontEnum {
  SansSerif = 'sans-serif',
  Serif = 'serif',
  Monospace = 'monospace',
}

export type FontStore = {
  currentFont: FontEnum;
};

export type FontStoreActions = {
  setFont: (font: FontEnum) => void;
};

export type FontStoreState = FontStore & FontStoreActions;

export const defaultNavbarStore: FontStore = {
  currentFont: FontEnum.SansSerif,
};

export const createFontStore = (
  storageKey: string = 'font-store',
  initialState: FontStore = defaultNavbarStore,
) => {
  return create<FontStoreState>()(
    persist(
      (set) => ({
        ...initialState,
        setFont(font) {
          set((state) => ({ ...state, currentFont: font }));
        },
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
};
