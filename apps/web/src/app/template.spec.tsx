import { describe, expect, it } from '@jest/globals';

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import RootTemplate from './template';

describe('Root Next Template', () => {
  describe('render', () => {
    it('should render', () => {
      const mockChildren = <div>Mock Children</div>;
      const result = render(<RootTemplate>{mockChildren}</RootTemplate>);

      expect(result.container.querySelector('#root-template-container')).toBeTruthy();
    });
  });
});
