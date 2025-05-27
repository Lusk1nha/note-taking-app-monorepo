import { cn } from '@note-taking-app/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const textVariants = cva('antialiased', {
  variants: {
    variant: {
      default: 'text-text-default-text',
    },
    size: {
      xs: 'system-preset-6',
      sm: 'system-preset-5',
      default: 'system-preset-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  className?: string;
  active?: boolean;
}

const Text = forwardRef<HTMLParagraphElement, TextProps>((props, ref) => {
  const { size, className, variant, active, title, children, ...rest } = props;

  return (
    <p
      data-component="Text"
      ref={ref}
      className={cn(
        textVariants({
          size,
          variant,
          className,
        })
      )}
      data-state={active ? 'active' : undefined}
      title={title ? title : children ? children.toString() : undefined}
      {...(title ? { 'aria-label': title } : {})}
      {...rest}
    >
      {children}
    </p>
  );
});

Text.displayName = 'Text';

export { Text, textVariants };
