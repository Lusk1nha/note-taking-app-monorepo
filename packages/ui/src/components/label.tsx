import { cn } from '@note-taking-app/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

const labelVariants = cva('antialised', {
	variants: {
		variant: {
			primary: 'text-label-primary-text disabled:text-label-primary-text-disabled',
		},
		size: {
			default: 'system-preset-4',
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'default',
	},
})

export interface LabelProps extends React.HTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {
	required?: boolean
}

const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
	const { children, className, variant, size, required, ...rest } = props

	return (
		<div className='flex items-center gap-x-050'>
			<label
				ref={ref}
				className={cn(labelVariants({ variant, size, className }))}
				{...rest}
			>
				{children}
			</label>

			{required && (
				<span
					className='system-preset-6 text-system-red-500'
					aria-hidden='true'
				>
					*
				</span>
			)}
		</div>
	)
})

Label.displayName = 'Label'

export { Label, labelVariants }
