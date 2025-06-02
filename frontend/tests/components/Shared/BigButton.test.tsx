import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BigButton from '../../../src/components/Shared/BigButton';

describe('BigButton', () => {
  const baseProps = {
    disabledText: 'Saving...',
    enabledText: 'Save Changes',
  };

  it('renders the enabled button with correct text and styling', () => {
    render(<BigButton {...baseProps} disabled={false} />);

    const button = screen.getByTestId('big-button_button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Save Changes');
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass('bg-primary-medium');
  });

  it('renders the disabled button with correct text and styling', () => {
    render(<BigButton {...baseProps} disabled={true} />);

    const button = screen.getByTestId('big-button_button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Saving...');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('bg-gray-500');
    expect(button).toHaveClass('cursor-not-allowed');
  });
});
