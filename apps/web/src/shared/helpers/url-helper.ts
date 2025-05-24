import { ReadonlyURLSearchParams } from 'next/navigation'

type SearchParam = {
	name: string
	value: string
}

export function createQueryString(
	currentParams: ReadonlyURLSearchParams,
	param: SearchParam,
) {
	const params = new URLSearchParams(currentParams.toString())
	params.set(param.name, param.value)

	return params.toString()
}
