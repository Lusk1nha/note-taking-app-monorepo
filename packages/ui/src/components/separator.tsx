import { cn } from '@note-taking-app/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const separatorVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'border-separator-default-base',
    },
    size: {
      default: 'w-full h-[1px] border-t',
      vertical: 'w-[1px] h-full border-l',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLHRElement>,
    VariantProps<typeof separatorVariants> {
  className?: string;
}

const Separator = forwardRef<HTMLHRElement, SeparatorProps>((props, ref) => {
  const { className, variant, size, ...rest } = props;
  return (
    <hr
      data-component="Separator"
      ref={ref}
      className={cn(
        separatorVariants({
          variant,
          size,
          className,
        })
      )}
      {...rest}
    />
  );
});

Separator.displayName = 'Separator';

export { Separator, separatorVariants };
