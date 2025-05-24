import { describe, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from './theme-provider'

describe('Theme Provider', () => {
	it('should render', () => {
		const mockChildren = <div>Mock Children</div>
		render(<ThemeProvider>{mockChildren}</ThemeProvider>)

		screen.debug()
	})
})
