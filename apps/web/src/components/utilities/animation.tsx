import { HTMLMotionProps, motion } from 'motion/react'

interface SpanAnimateWrapperProps extends HTMLMotionProps<'span'> {
	children: React.ReactNode
	className?: string
}

interface ListAnimateWrapperProps extends HTMLMotionProps<'ul'> {
	children: React.ReactNode
	className?: string
}

interface NumberedListAnimateWrapperProps extends HTMLMotionProps<'ol'> {
	children: React.ReactNode
	className?: string
}

const defaultAnimateProps: Omit<SpanAnimateWrapperProps, 'children'> = {}

export function FadeAnimate(props: Readonly<SpanAnimateWrapperProps>) {
	const { children, className, ...rest } = props
	return (
		<motion.span
			data-animation='fade'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className={className}
			{...defaultAnimateProps}
			{...rest}
		>
			{children}
		</motion.span>
	)
}

export type SlideDirection = 'left' | 'right' | 'up' | 'down'

interface SlideAnimateProps extends SpanAnimateWrapperProps {
	direction?: SlideDirection
}

export function SlideAnimate(props: Readonly<SlideAnimateProps>) {
	const { children, className, direction = 'left', ...rest } = props
	return (
		<motion.span
			data-animation='slide'
			initial={{
				x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
				y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
				opacity: 0,
			}}
			animate={{ x: 0, y: 0, opacity: 1 }}
			className={className}
			{...defaultAnimateProps}
			{...rest}
		>
			{children}
		</motion.span>
	)
}

export function SpinAnimate(props: Readonly<SpanAnimateWrapperProps>) {
	const { children, className, ...rest } = props
	return (
		<motion.span
			data-animation='spin'
			initial={{ rotate: 0, opacity: 0 }}
			animate={{ rotate: 360, opacity: 1 }}
			className={className}
			{...defaultAnimateProps}
			{...rest}
		>
			{children}
		</motion.span>
	)
}

export function NumberedListFadeInAnimate(
	props: Readonly<NumberedListAnimateWrapperProps>,
) {
	const { children, className, ...rest } = props
	return (
		<motion.ol
			data-animation='list-fade-in'
			variants={{
				visible: {
					transition: {
						delayChildren: 0.2,
						staggerChildren: 0.05,
					},
				},
			}}
			initial='hidden'
			animate='visible'
			className={className}
			{...rest}
		>
			{children}
		</motion.ol>
	)
}

export function ListFadeInAnimate(props: Readonly<ListAnimateWrapperProps>) {
	const { children, className, ...rest } = props
	return (
		<motion.ul
			data-animation='list-fade-in'
			variants={{
				visible: {
					transition: {
						delayChildren: 0.2,
						staggerChildren: 0.05,
					},
				},
			}}
			initial='hidden'
			animate='visible'
			className={className}
			{...rest}
		>
			{children}
		</motion.ul>
	)
}

export function ItemFadeInAnimate(props: Readonly<HTMLMotionProps<'li'>>) {
	const { children, ...rest } = props
	return (
		<motion.li
			data-animation='list-fade-in-item'
			variants={{
				hidden: {
					opacity: 0,
				},
				visible: {
					opacity: 1,
				},
			}}
			{...rest}
		>
			{children}
		</motion.li>
	)
}
