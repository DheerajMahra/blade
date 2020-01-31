import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Button from '../index';

describe('Renders <Button /> correctly', () => {
  it('onPress works as expected', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button onClick={mockOnPress}>{'Click Me'}</Button>);
    const button = getByText('Click Me');
    fireEvent.click(button);
    expect(mockOnPress.mock.calls.length).toBe(1);
  });
});
