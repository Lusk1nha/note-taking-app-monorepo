'use client'

import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@note-taking-app/ui/button'
import { OptionSelector } from '@note-taking-app/ui/option-selector'

import { Controller, useForm } from 'react-hook-form'

import { useFontStore } from '@/providers/font-store-provider'
import { FONT_OPTIONS, FontEnumType } from '@/shared/constants/font-constants'
import { FontEnum } from '@/shared/stores/font-store'

import { FontFormType, fontValidation } from '@/shared/validations/font-theme-validation'

export function FontThemeForm() {
	const font = useFontStore((state) => state.currentFont)
	const setFont = useFontStore((state) => state.setFont)

	const form = useForm<FontFormType>({
		defaultValues: {
			font: font as FontFormType['font'],
		},
		resolver: zodResolver(fontValidation),
	})

	const { handleSubmit } = form

	async function onSubmit(data: FontFormType) {
		const { font } = data
		setFont(font as FontEnum)
	}

	return (
		<form className='flex flex-col gap-y-250' onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name='font'
				control={form.control}
				render={({ field: { onChange, value } }) => (
					<OptionSelector<FontEnumType>
						selectedId={value}
						onSelect={(id) => onChange(id)}
						options={FONT_OPTIONS}
					/>
				)}
			/>

			<div className='flex justify-end'>
				<Button type='submit'>Apply Changes</Button>
			</div>
		</form>
	)
}
