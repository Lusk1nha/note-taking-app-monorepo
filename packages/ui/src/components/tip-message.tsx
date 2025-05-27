import { cva, VariantProps } from 'class-variance-authority';
import { AlertTriangle, InfoIcon, LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

const tipMessageVariants = cva('flex items-center gap-x-100', {
  variants: {
    variant: {
      default: 'text-tip-message-info-text',
      error: 'text-tip-message-error-text',
    },
    size: {
      default: 'system-preset-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const tipMessageIconMap: Record<
  NonNullable<VariantProps<typeof tipMessageVariants>['variant']>,
  LucideIcon
> = {
  default: InfoIcon,
  error: AlertTriangle,
};

export interface TipMessageProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tipMessageVariants> {}

const TipMessage = forwardRef<HTMLDivElement, TipMessageProps>((props, ref) => {
  const { children, className, variant = 'default', size, ...rest } = props;

  const Icon = tipMessageIconMap[variant ?? 'default'];

  return (
    <span className={tipMessageVariants({ variant, size, className })} ref={ref} {...rest}>
      <Icon className="w-3 h-3" />
      {children}
    </span>
  );
});

TipMessage.displayName = 'TipMessage';

export { TipMessage, tipMessageVariants };
