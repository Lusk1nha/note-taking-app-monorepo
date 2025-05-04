'use client';

import { useFontStore } from '@/providers/font-store-provider';
import { FontEnum } from '@/shared/stores/font-store';

export default function DashboardPage() {
  const setFont = useFontStore((state) => state.setFont);

  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <div className="system-preset-1">Hello world!</div>
        <div className="system-preset-2">Hello world!</div>
        <div className="system-preset-3">Hello world!</div>
        <div className="system-preset-4">Hello world!</div>
        <div className="system-preset-5">Hello world!</div>
        <div className="system-preset-6">Hello world!</div>
      </div>

      <div>
        <button type="button" onClick={() => setFont(FontEnum.SansSerif)}>
          Sans Serif
        </button>
        <button type="button" onClick={() => setFont(FontEnum.Serif)}>
          Serif
        </button>
        <button type="button" onClick={() => setFont(FontEnum.Monospace)}>
          Monospace
        </button>
      </div>
    </main>
  );
}
