import { APP_DESCRIPTION, APP_NAME } from '@/shared/constants'
import { beforeAll, describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import RootLayout, { metadata } from '../app/layout'

describe('Root Next layout', () => {
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

	describe('metadata', () => {
		it('should be exported', () => {
			expect(metadata).toBeDefined()
		})

		it('should contain a `title` and `description`', () => {
			expect(metadata).toHaveProperty('title')
			expect(metadata).toHaveProperty('description')
		})

		it('should have a title equals to APP_NAME', () => {
			expect(metadata.title).toBe(APP_NAME)
		})

		it('should have a description equals to APP_DESCRIPTION', () => {
			expect(metadata.description).toBe(APP_DESCRIPTION)
		})
	})

	describe('render', () => {
		it('should render', () => {
			const mockChildren = <div>Mock Children</div>
			render(<RootLayout>{mockChildren}</RootLayout>)

			screen.debug()
		})
	})
})
