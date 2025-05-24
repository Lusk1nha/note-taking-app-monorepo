import { beforeAll, describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { SystemProviders } from './system-providers'

describe('System Providers', () => {
	beforeAll(() => {
		// Mocking matchMedia for testing purposes
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		})
	})

	it('should render', () => {
		const mockChildren = <div>Mock Children</div>

		render(<SystemProviders>{mockChildren}</SystemProviders>)
		expect(screen.getByText('Mock Children')).toBeTruthy()
	})
})
