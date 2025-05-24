'use client'

import { createQueryString } from '@/shared/helpers/url-helper'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@note-taking-app/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ControlledInput } from '../inputs/controlled-input'

const searchContentValidation = z.object({
	search: z.string().min(1, { message: 'Search term is required' }),
})

type SearchContentFormType = z.infer<typeof searchContentValidation>

export function SearchContentForm() {
	const searchParams = useSearchParams()
	const router = useRouter()

	const form = useForm<SearchContentFormType>({
		defaultValues: {
			search: '',
		},
		resolver: zodResolver(searchContentValidation),
	})

	const { handleSubmit } = form

	async function onSubmit(data: SearchContentFormType) {
		const { search } = data
		const queryString = createQueryString(searchParams, {
			name: 'search',
			value: search,
		})
		const path = `/search?${queryString}`

		router.push(path)
	}

	function onEnterKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter') {
			event.preventDefault()
			handleSubmit(onSubmit)()
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<ControlledInput
				name='search'
				control={form.control}
				required
				field={{
					className: 'w-[300px]',
					onKeyDown: onEnterKeyPress,
					placeholder: 'Search by title, content, or tags…',
				}}
			/>
		</form>
	)
}
