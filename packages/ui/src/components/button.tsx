import { cn } from '@note-taking-app/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-8 cursor-pointer focus:outline-none focus:ring-2 ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-button-primary-base hover:bg-button-primary-hover text-button-primary-text disabled:bg-button-primary-base-disabled disabled:text-button-primary-text-disabled ring-button-primary-ring-active ring-offset-button-primary-ring-offset',
        ghost:
          'bg-button-ghost-base text-button-ghost-text hover:bg-button-ghost-hover disabled:bg-button-ghost-base-disabled disabled:text-button-ghost-text-disabled ring-button-ghost-ring-active ring-offset-button-ghost-ring-offset',
      },
      size: {
        default: 'py-3 px-4 system-preset-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, variant, size, ...rest } = props;

  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...rest}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
