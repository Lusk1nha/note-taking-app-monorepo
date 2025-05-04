import { describe, it } from '@jest/globals';
import { ThemeProvider } from './theme-provider';
import { render, screen } from '@testing-library/react';

describe('Theme Provider', () => {
  it('should render', () => {
    const mockChildren = <div>Mock Children</div>;
    render(<ThemeProvider>{mockChildren}</ThemeProvider>);

    screen.debug();
  });
});
