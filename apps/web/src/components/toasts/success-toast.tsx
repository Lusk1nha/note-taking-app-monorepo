'use client';

import { CheckCircle2, X } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface SuccessToastProps {
  id: string | number;

  title: string;
  tag?: string;
  children?: string;
}

export function SuccessToast(props: Readonly<SuccessToastProps>) {
  const { id, title, children, tag } = props;

  const dismissToast = useCallback(() => toast.dismiss(id), [id]);

  return (
    <div className="min-h-8 sm:min-w-[390px] bg-toast-default-base border border-toast-default-border rounded-8 py-075 gap-y-100 flex flex-col items-center shadow shadow-dashboard-base">
      <section className="flex items-center justify-between w-full px-100 gap-x-100">
        <div className="flex items-center gap-x-100">
          <span className="h-4 w-4 text-toast-success-base">
            <CheckCircle2 size={16} />
          </span>

          <p className="system-preset-6 text-toast-default-title font-semibold">
            {title}
          </p>
        </div>

        <div className="flex items-center gap-x-100">
          {tag && (
            <span className="hidden sm:block system-preset-6 text-toast-default-tag underline">
              {tag}
            </span>
          )}

          <button
            type="button"
            onClick={dismissToast}
            className="flex items-center justify-center text-toast-close-button-text h-4 w-4 cursor-pointer"
          >
            <X />
          </button>
        </div>
      </section>

      {children && (
        <div className="w-full px-4">
          <p className="system-preset-6">{children}</p>
        </div>
      )}
    </div>
  );
}
