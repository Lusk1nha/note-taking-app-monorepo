import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { FontStoreProvider } from './font-store-provider'

describe('Font Provider Component', () => {
	it('should render', () => {
		const mockChildren = <div>Mock Children</div>
		render(<FontStoreProvider children={mockChildren} />)

		screen.debug()
	})

	it('should contain the children', () => {
		const mockChildren = <div>Mock Children</div>
		render(<FontStoreProvider children={mockChildren} />)

		expect(screen.getByText('Mock Children')).toBeTruthy()
	})
})
