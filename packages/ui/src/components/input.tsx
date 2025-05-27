import { cn } from '@note-taking-app/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const inputVariants = cva('w-full flex rounded-8 focus:outline-0 focus:ring-2 ring-offset-2', {
  variants: {
    variant: {
      default: `
          bg-input-default-base hover:bg-input-default-base-hover
          text-input-default-text placeholder:text-input-default-placeholder
          border border-input-default-border hover:border-input-default-border-hover data-[error=true]:border-input-default-border-error
          focus:ring-input-ring-active ring-offset-input-ring-offset
          disabled:bg-input-default-base-disabled disabled:text-input-default-text-disabled
        `,
    },
    size: {
      default: 'h-11 px-3 system-preset-5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  className?: string;
  icon?: React.ReactNode;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, variant, size, icon, error, ...rest } = props;

  return (
    <input
      ref={ref}
      className={cn(inputVariants({ variant, size, className }))}
      {...rest}
      aria-invalid={error ? 'true' : undefined}
      aria-errormessage={error ? 'error-message' : undefined}
      aria-required="true"
      data-error={error ? 'true' : undefined}
    />
  );
});

Input.displayName = 'Input';

export { Input, inputVariants };
