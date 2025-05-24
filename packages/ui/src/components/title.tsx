import { cn } from '@note-taking-app/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

const titleVariants = cva('antialiased', {
	variants: {
		variant: {
			default: 'text-title-default-text',
			secondary: 'text-title-secondary-text',
		},
		size: {
			default: 'system-preset-4',
			xl: 'system-preset-1',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
})

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof titleVariants> {
	className?: string
	active?: boolean
}

const Title = forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
	const { size, className, variant, active, children, title, ...rest } = props

	return (
		<h1
			data-component='Title'
			ref={ref}
			className={cn(
				titleVariants({
					variant,
					size,
					className,
				}),
			)}
			data-state={active ? 'active' : undefined}
			title={title ? title : children ? children.toString() : undefined}
			{...(title ? { 'aria-label': title } : {})}
			{...rest}
		>
			{children}
		</h1>
	)
})

Title.displayName = 'Title'

export { Title, titleVariants }
